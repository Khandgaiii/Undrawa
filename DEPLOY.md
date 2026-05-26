# Deploy Undrawa to Vercel

The **website** runs on Vercel. The **Android app** uses a separate static build for Capacitor.

## Website (Vercel)

1. Push this project to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework: **Next.js** (auto-detected).
4. Build command: `npm run build`
5. Deploy.

Or with CLI:

```bash
npm install -g vercel
cd waterleak-dashboard
vercel
```

## Important: ESP32 connection

The dashboard talks to the ESP32 **on your local Wi‑Fi** (`http://undrawa.local` or the device IP).

- **Vercel site + phone app:** work when your phone/browser is on the **same Wi‑Fi** as the ESP32.
- The ESP32 is **not** reachable from the public internet unless you add port forwarding or a tunnel (not included).

## Android APK build

```bash
npm run build:mobile
npx cap sync android
cd android
gradlew.bat assembleDebug
```

## Environment

No API keys required for basic deployment. WiFi and phone number are configured in `firmware/undrawa_esp32/config.h` on the device.
