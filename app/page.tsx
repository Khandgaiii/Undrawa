'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Navbar } from '@/components/navbar'
import { AuthScreen } from '@/components/auth-screen'
import { HardwareMonitor } from '@/components/hardware-monitor'
import { LeakDetection } from '@/components/leak-detection'
import { ControlCenter } from '@/components/control-center'
import { DeviceSettings } from '@/components/device-settings'
import { type Language, translations } from '@/lib/translations'
import { useUndrawaDevice } from '@/hooks/use-undrawa-device'
import { resetDeviceLeak } from '@/lib/device-api'
import { Capacitor } from '@capacitor/core'
import {
  requestLeakNotificationPermission,
  sendLeakDetectedNotification,
} from '@/lib/notifications'
import { completeGoogleRedirectWeb, signInWithGoogleWeb } from '@/lib/firebase-web'

export default function UndrawaDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [language, setLanguage] = useState<Language>('en')

  const {
    baseUrl,
    connected,
    discovering,
    status,
    error,
    setRelay,
    runDiscovery,
    connectManual,
    disconnect,
    poll,
  } = useUndrawaDevice({ enabled: isAuthenticated })

  const liveDevice = connected && status != null
  const t = translations[language]
  const hadLeak = useRef(false)
  const isNativeApp = Capacitor.isNativePlatform()

  const handleRelayToggle = useCallback(
    async (engaged: boolean) => {
      if (!liveDevice) return
      await setRelay(engaged)
    },
    [liveDevice, setRelay]
  )

  const handleClearAlert = useCallback(async () => {
    if (!baseUrl) return
    try {
      await resetDeviceLeak(baseUrl)
      await poll()
    } catch {
      /* poll will surface error */
    }
  }, [baseUrl, poll])

  const handleLogin = () => setIsAuthenticated(true)
  const handleGoogleLogin = useCallback(async (): Promise<string | null> => {
    const result = await signInWithGoogleWeb()
    if (result.user) {
      setIsAuthenticated(true)
      return null
    }
    if (result.redirectStarted) {
      return null
    }
    return result.errorMessage ?? 'Google sign-in failed.'
  }, [])
  const handleLogout = () => {
    setIsAuthenticated(false)
    disconnect()
  }
  const handleLanguageChange = (lang: Language) => setLanguage(lang)

  useEffect(() => {
    if (isNativeApp) return
    let cancelled = false
    const finishRedirect = async () => {
      const user = await completeGoogleRedirectWeb()
      if (!cancelled && user) {
        setIsAuthenticated(true)
      }
    }
    void finishRedirect()
    return () => {
      cancelled = true
    }
  }, [isNativeApp])

  useEffect(() => {
    if (!isAuthenticated) return
    void requestLeakNotificationPermission()
  }, [isAuthenticated])

  useEffect(() => {
    const isLeakingNow = Boolean(liveDevice && status?.isLeaking)
    if (isLeakingNow && !hadLeak.current) {
      void sendLeakDetectedNotification()
    }
    hadLeak.current = isLeakingNow
  }, [liveDevice, status?.isLeaking])

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isAuthenticated={isAuthenticated}
        language={language}
        onLanguageChange={handleLanguageChange}
        esp32Online={liveDevice && (status?.esp32Online ?? false)}
        sim900Online={liveDevice && (status?.sim900Online ?? false)}
        t={t}
        onLogout={handleLogout}
      />

      {!isAuthenticated ? (
        <AuthScreen
          onLogin={handleLogin}
          onGoogleLogin={isNativeApp ? undefined : handleGoogleLogin}
          t={t}
        />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground">{t.dashboard}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {liveDevice ? t.dashboardLive : t.dashboardWaiting}
            </p>
          </div>

          <DeviceSettings
            connected={connected}
            discovering={discovering}
            baseUrl={baseUrl}
            error={error}
            t={t}
            onConnect={connectManual}
            onDiscover={runDiscovery}
            onDisconnect={disconnect}
          />

          <HardwareMonitor
            esp32Online={status?.esp32Online ?? false}
            sim900Online={status?.sim900Online ?? false}
            liveDevice={liveDevice}
            t={t}
          />

          <LeakDetection
            isLeaking={status?.isLeaking ?? false}
            t={t}
            waterLevelPercent={status?.waterLevelPercent ?? null}
            liveDevice={liveDevice}
            lowWater={status?.lowWater ?? false}
            smsSent={status?.smsSent ?? false}
            onClearAlert={liveDevice && status?.isLeaking ? handleClearAlert : undefined}
          />

          <ControlCenter
            relayEngaged={status?.relayEngaged ?? false}
            onRelayToggle={handleRelayToggle}
            t={t}
            disabled={!liveDevice}
          />

          <footer className="pt-8 pb-4 text-center text-xs text-muted-foreground animate-fade-in">
            <p>{t.footerTitle}</p>
            <p className="mt-1">{t.footerSubtitle}</p>
          </footer>
        </main>
      )}
    </div>
  )
}
