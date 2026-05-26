'use client'

import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

export function SafeAreaInit() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    document.documentElement.classList.add('capacitor-native')

    const setup = async () => {
      try {
        // Keep content edge-to-edge; navbar CSS handles the status bar gap once
        await StatusBar.setOverlaysWebView({ overlay: true })
        await StatusBar.setStyle({ style: Style.Dark })
      } catch {
        // CSS fallback on .safe-area-top still applies
      }
    }

    void setup()
  }, [])

  return null
}
