# Build Undrawa as Android APK

This app is wrapped with [Capacitor](https://capacitorjs.com/) so the Next.js UI runs inside a native Android WebView.

## Prerequisites (one-time)

1. **Node.js** 18+ (you already have this for Next.js)
2. **Android Studio** — install from https://developer.android.com/studio  
   During setup, install the **Android SDK** and accept licenses.
3. Set environment variables (Windows, after installing Android Studio):
   - `ANDROID_HOME` = `C:\Users\<You>\AppData\Local\Android\Sdk`
   - Add to `Path`: `%ANDROID_HOME%\platform-tools` and `%ANDROID_HOME%\tools`

## Build debug APK

```bash
npm install
npm run build:mobile
npx cap add android
npx cap sync android
cd android
gradlew.bat assembleDebug
```

The APK is created at:

`android/app/build/outputs/apk/debug/app-debug.apk`

Copy that file to your phone and install (enable “Install unknown apps” if prompted).

## One-command build (after `cap add android` once)

```bash
npm run android:apk
```

## Open in Android Studio (optional)

```bash
npm run build:mobile
npx cap sync android
npm run cap:open:android
```

Then use **Build → Build Bundle(s) / APK(s) → Build APK(s)** for a signed release build.

## Notes

- The dashboard uses **simulated** hardware state in the browser/WebView; real ESP32/SIM900 would need a backend or native Bluetooth/WiFi plugins later.
- For Play Store release, create a signing key and use `assembleRelease` with signing config in `android/app/build.gradle`.
