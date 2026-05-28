// Copy this file and edit values before uploading to ESP32.
// WiFi — phone and ESP32 must be on the same network.

#ifndef UNDRAWA_CONFIG_H
#define UNDRAWA_CONFIG_H

#define WIFI_SSID "KOOSEN G313"
#define WIFI_PASSWORD "99325107"

// SIM card must support SMS. Include country code, e.g. +976XXXXXXXX
#define ALERT_PHONE "+97694156086"

// --- SIM900 UART (must match your wiring) ---
// false = RX2/TX2 on GPIO 16 & 17 (best — USB Serial Monitor works at 115200)
// true  = RX0/TX0 on GPIO 3 & 1 (your wiring: 3VT→RX0, 3VR←TX0)
#define SIM_ON_RX0_TX0 true
#define SIM_RX_PIN 16   // ESP RX0 ← SIM 3VT (SIM transmits)
#define SIM_TX_PIN 17   // ESP TX0 → SIM 3VR (SIM receives)
#define SIM_BAUD 9600

// --- Pin map = numbers printed ON your ESP32 board (not the word "GPIO") ---
// D4  → pin marked "4" or "D4"     (leak +)
// 34  → pin marked "34" or "D34"   (water S)
// 26  → pin marked "26" or "D26" (relay IN1)
#define PIN_LEAK_SENSOR 4
#define PIN_WATER_LEVEL 34
#define PIN_RELAY 26

// Relay module: most boards are ACTIVE LOW (LOW = relay ON = valve shut)
#define RELAY_ACTIVE_LOW true

// Leak sensor: true if pin reads HIGH when water is detected
#define LEAK_ACTIVE_HIGH true

// Water level ADC calibration (read Serial monitor to tune)
#define LEVEL_ADC_EMPTY 500     // ADC when tank/pipe is empty
#define LEVEL_ADC_FULL 3500     // ADC when full

// Alert when level below this percent
#define LOW_WATER_PERCENT 15

// Leak: also trigger if level drops this much in 10 seconds (%)
#define LEVEL_DROP_LEAK_PERCENT 8

// --- Sensor stability tuning ---
// Moisture sensor must stay wet this long before leak is confirmed.
#define LEAK_SENSOR_WET_CONFIRM_MS 1200
// Moisture sensor must stay dry this long before leak clears automatically.
#define LEAK_SENSOR_DRY_CLEAR_MS 8000
// Ignore rapid-drop detection right after boot (seconds).
#define LEVEL_DROP_ARM_DELAY_MS 20000
// Only evaluate rapid-drop leak when level is above this percent.
#define LEVEL_DROP_MIN_START_PERCENT 20.0f
// EMA smoothing factor for level percentage (0..1, higher = more reactive).
#define LEVEL_FILTER_ALPHA 0.18f

// mDNS hostname → app connects at http://undrawa.local
#define MDNS_HOSTNAME "undrawa"

#endif
