#include <WiFi.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include "config.h"

WebServer server(80);

#if SIM_ON_RX0_TX0
// UART0 (RX0/TX0) = same port as USB; used for SIM900 at 9600 baud
HardwareSerial& sim900 = Serial;
#define MON Serial2  // optional debug on GPIO 16/17 if you wire USB-TTL there
#else
HardwareSerial sim900(2);
#define MON Serial
#endif

// --- Runtime state (matches Undrawa app) ---
bool sim900Ready = false;
bool isLeaking = false;
bool relayEngaged = false;
bool smsSentForEvent = false;
bool smsRetryPending = false;
unsigned long leakDetectedAt = 0;
unsigned long lastSmsAt = 0;
unsigned long lastSmsRetryAt = 0;
unsigned long lastLevelSampleAt = 0;
float waterLevelPercent = 0;
int waterLevelRaw = 0;
float levelAtWindowStart = 0;
unsigned long levelWindowStart = 0;

const unsigned long SMS_COOLDOWN_MS = 300000;  // 5 min between SMS
const unsigned long AUTO_RELAY_DELAY_MS = 2000; // same as app UI
const unsigned long LEVEL_WINDOW_MS = 10000;

// ---------------------------------------------------------------------------
void setRelay(bool engaged) {
  relayEngaged = engaged;
  if (RELAY_ACTIVE_LOW) {
    digitalWrite(PIN_RELAY, engaged ? LOW : HIGH);
  } else {
    digitalWrite(PIN_RELAY, engaged ? HIGH : LOW);
  }
}

bool readLeakSensor() {
  int v = digitalRead(PIN_LEAK_SENSOR);
  return LEAK_ACTIVE_HIGH ? (v == HIGH) : (v == LOW);
}

int readLevelRaw() {
  long sum = 0;
  for (int i = 0; i < 16; i++) {
    sum += analogRead(PIN_WATER_LEVEL);
    delay(2);
  }
  return (int)(sum / 16);
}

float rawToPercent(int raw) {
  float p = (float)(raw - LEVEL_ADC_EMPTY) / (float)(LEVEL_ADC_FULL - LEVEL_ADC_EMPTY) * 100.0f;
  if (p < 0) p = 0;
  if (p > 100) p = 100;
  return p;
}

void sendCorsHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

String jsonStatus() {
  bool valveClosed = relayEngaged;
  bool lowWater = waterLevelPercent < LOW_WATER_PERCENT;

  String j = "{";
  j += "\"device\":\"Undrawa\",";
  j += "\"hostName\":\"" MDNS_HOSTNAME ".local\",";
  j += "\"ipAddress\":\"";
  j += WiFi.localIP().toString();
  j += "\",";
  j += "\"esp32Online\":true,";
  j += "\"sim900Online\":" + String(sim900Ready ? "true" : "false") + ",";
  j += "\"isLeaking\":" + String(isLeaking ? "true" : "false") + ",";
  j += "\"relayEngaged\":" + String(relayEngaged ? "true" : "false") + ",";
  j += "\"valveClosed\":" + String(valveClosed ? "true" : "false") + ",";
  j += "\"waterLevelPercent\":" + String(waterLevelPercent, 1) + ",";
  j += "\"waterLevelRaw\":" + String(waterLevelRaw) + ",";
  j += "\"lowWater\":" + String(lowWater ? "true" : "false") + ",";
  j += "\"smsSent\":" + String(smsSentForEvent ? "true" : "false") + ",";
  j += "\"uptimeMs\":" + String(millis());
  j += "}";
  return j;
}

// ---------------------------------------------------------------------------
// SIM900 helpers
void sim900Drain() {
  unsigned long t = millis();
  while (millis() - t < 80) {
    while (sim900.available()) sim900.read();
    delay(2);
  }
}

bool sim900SendCmd(const char* cmd, const char* expect, unsigned long timeoutMs) {
  sim900Drain();
  sim900.println(cmd);
  String buf;
  unsigned long start = millis();
  while (millis() - start < timeoutMs) {
    while (sim900.available()) {
      buf += (char)sim900.read();
    }
    if (expect && buf.indexOf(expect) >= 0) return true;
    if (!expect && buf.indexOf("OK") >= 0) return true;
  }
  return false;
}

bool sim900WaitNetwork(unsigned long timeoutMs) {
  unsigned long start = millis();
  while (millis() - start < timeoutMs) {
    if (sim900SendCmd("AT+CREG?", "+CREG: 0,1", 2500)) return true;
    if (sim900SendCmd("AT+CREG?", "+CREG: 0,5", 2500)) return true;
    delay(1500);
  }
  return false;
}

bool initSim900() {
#if !SIM_ON_RX0_TX0
  sim900.begin(SIM_BAUD, SERIAL_8N1, SIM_RX_PIN, SIM_TX_PIN);
#endif
  delay(2000);
  for (int i = 0; i < 5; i++) {
    if (sim900SendCmd("AT", "OK", 2000)) break;
    delay(500);
  }
  if (!sim900SendCmd("ATE0", "OK", 2000)) return false;
  if (!sim900SendCmd("AT+CMGF=1", "OK", 2000)) return false;
  if (!sim900SendCmd("AT+CSCS=\"GSM\"", "OK", 2000)) return false;
  if (!sim900SendCmd("AT+CSMP=17,167,0,0", "OK", 2000)) return false;
  sim900WaitNetwork(45000);
  return sim900SendCmd("AT", "OK", 2000);
}

bool sendLeakSms(float levelPct) {
  if (!sim900Ready) return false;
  if (millis() - lastSmsAt < SMS_COOLDOWN_MS) return false;

  char msg[140];
  snprintf(msg, sizeof(msg),
           "UNDRAWA: Leak detected! Water %.0f%%. Valve closed. Check system.",
           levelPct);

  for (int attempt = 0; attempt < 3; attempt++) {
    sim900Drain();
    if (!sim900SendCmd("AT+CMGF=1", "OK", 2000)) {
      delay(1500);
      continue;
    }

    sim900.print("AT+CMGS=\"");
    sim900.print(ALERT_PHONE);
    sim900.println("\"");
    delay(600);

    String pre = "";
    unsigned long t0 = millis();
    while (millis() - t0 < 5000) {
      while (sim900.available()) pre += (char)sim900.read();
      if (pre.indexOf('>') >= 0) break;
    }
    if (pre.indexOf('>') < 0) {
      delay(1500);
      continue;
    }

    sim900.print(msg);
    sim900.write(26);
    delay(100);

    String resp = "";
    unsigned long t1 = millis();
    while (millis() - t1 < 15000) {
      while (sim900.available()) resp += (char)sim900.read();
      if (resp.indexOf("+CMGS:") >= 0 || resp.indexOf("OK") >= 0) {
        lastSmsAt = millis();
        smsSentForEvent = true;
        smsRetryPending = false;
        MON.println(F("[SIM900] SMS sent OK"));
        return true;
      }
      if (resp.indexOf("ERROR") >= 0) break;
    }
    delay(2000);
  }

  MON.println(F("[SIM900] SMS failed — will retry"));
  return false;
}

void processSmsRetry() {
  if (!isLeaking || smsSentForEvent || !sim900Ready) {
    smsRetryPending = false;
    return;
  }
  if (!smsRetryPending) return;
  if (millis() - lastSmsRetryAt < 15000) return;

  lastSmsRetryAt = millis();
  if (sendLeakSms(waterLevelPercent)) {
    smsRetryPending = false;
  }
}

// ---------------------------------------------------------------------------
void triggerLeak(const char* reason) {
  if (!isLeaking) {
    isLeaking = true;
    leakDetectedAt = millis();
    smsSentForEvent = false;
    MON.print(F("[LEAK] "));
    MON.println(reason);
    if (!sendLeakSms(waterLevelPercent)) {
      smsRetryPending = true;
      lastSmsRetryAt = 0;
    }
  }
}

void clearLeak() {
  isLeaking = false;
  leakDetectedAt = 0;
  smsSentForEvent = false;
  smsRetryPending = false;
  setRelay(false);
}

void updateSensors() {
  waterLevelRaw = readLevelRaw();
  waterLevelPercent = rawToPercent(waterLevelRaw);

  if (readLeakSensor()) {
    triggerLeak("moisture sensor");
  }

  unsigned long now = millis();
  if (now - lastLevelSampleAt >= 500) {
    lastLevelSampleAt = now;

    if (now - levelWindowStart >= LEVEL_WINDOW_MS) {
      levelWindowStart = now;
      levelAtWindowStart = waterLevelPercent;
    } else {
      float drop = levelAtWindowStart - waterLevelPercent;
      if (drop >= LEVEL_DROP_LEAK_PERCENT) {
        triggerLeak("rapid level drop");
      }
    }
  }
}

void handleAutoRelay() {
  if (isLeaking && !relayEngaged && leakDetectedAt > 0) {
    if (millis() - leakDetectedAt >= AUTO_RELAY_DELAY_MS) {
      setRelay(true);
      MON.println(F("[VALVE] Auto shut — relay engaged"));
    }
  }
}

// ---------------------------------------------------------------------------
void handleOptions() {
  sendCorsHeaders();
  server.send(204);
}

void handlePing() {
  sendCorsHeaders();
  server.send(200, "application/json",
               "{\"ok\":true,\"device\":\"Undrawa\",\"hostName\":\"" MDNS_HOSTNAME ".local\"}");
}

void handleStatus() {
  sendCorsHeaders();
  server.send(200, "application/json", jsonStatus());
}

void handleRelay() {
  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "POST only");
    return;
  }

  String body = server.arg("plain");
  bool engaged = body.indexOf("\"engaged\":true") >= 0 || body.indexOf("\"engaged\": true") >= 0;

  setRelay(engaged);
  if (!engaged && !readLeakSensor()) {
    // Manual open — clear leak latch if sensor is dry
    isLeaking = false;
    leakDetectedAt = 0;
    smsSentForEvent = false;
  }

  sendCorsHeaders();
  server.send(200, "application/json", jsonStatus());
  MON.print(F("[API] relay -> "));
  MON.println(engaged ? "ENGAGED" : "disengaged");
}

void handleResetLeak() {
  clearLeak();
  sendCorsHeaders();
  server.send(200, "application/json", jsonStatus());
}

void setupRoutes() {
  server.on("/api/ping", HTTP_GET, handlePing);
  server.on("/api/status", HTTP_GET, handleStatus);
  server.on("/api/relay", HTTP_POST, handleRelay);
  server.on("/api/reset-leak", HTTP_POST, handleResetLeak);
  server.on("/api/ping", HTTP_OPTIONS, handleOptions);
  server.on("/api/status", HTTP_OPTIONS, handleOptions);
  server.on("/api/relay", HTTP_OPTIONS, handleOptions);
  server.on("/api/reset-leak", HTTP_OPTIONS, handleOptions);
  server.onNotFound([]() {
    sendCorsHeaders();
    server.send(404, "application/json", "{\"error\":\"not found\"}");
  });
}

void setupWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  MON.print(F("WiFi connecting"));
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 30000) {
    delay(500);
    MON.print('.');
  }
  MON.println();
  if (WiFi.status() == WL_CONNECTED) {
    MON.print(F("IP: "));
    MON.println(WiFi.localIP());
    if (MDNS.begin(MDNS_HOSTNAME)) {
      MDNS.addService("http", "tcp", 80);
      MON.print(F("App URL: http://"));
      MON.print(MDNS_HOSTNAME);
      MON.println(F(".local"));
    }
  } else {
    MON.println(F("WiFi failed — check config.h"));
  }
}

void setup() {
#if SIM_ON_RX0_TX0
  Serial.begin(SIM_BAUD, SERIAL_8N1, SIM_RX_PIN, SIM_TX_PIN);
  MON.begin(115200);
#else
  MON.begin(115200);
#endif
  delay(300);
  MON.println(F("\n=== Undrawa ESP32 ==="));

  pinMode(PIN_LEAK_SENSOR, INPUT);
  pinMode(PIN_RELAY, OUTPUT);
  setRelay(false);

  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  setupWiFi();
  sim900Ready = initSim900();
  MON.println(sim900Ready ? F("SIM900 ready") : F("SIM900 not detected"));

  setupRoutes();
  server.begin();
  MON.println(F("HTTP API on port 80"));
  MON.println(F("  GET  /api/status"));
  MON.println(F("  POST /api/relay  {\"engaged\":true}"));
#if SIM_ON_RX0_TX0
  MON.println(F("Note: SIM900 on RX0/TX0 — use Undrawa app for status"));
#endif
}

void loop() {
  server.handleClient();
  updateSensors();
  handleAutoRelay();
  processSmsRetry();
  delay(20);
}