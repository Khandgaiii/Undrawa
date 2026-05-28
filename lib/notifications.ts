'use client'

import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'

const WEB_NOTIFICATION_TITLE = 'Undrawa Alert'
const WEB_NOTIFICATION_BODY = 'Water leak detected. Check your device now.'

export async function requestLeakNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false

  if (Capacitor.isNativePlatform()) {
    const permission = await LocalNotifications.requestPermissions()
    return permission.display === 'granted'
  }

  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export async function sendLeakDetectedNotification(): Promise<void> {
  if (typeof window === 'undefined') return

  const granted = await requestLeakNotificationPermission()
  if (!granted) return

  if (Capacitor.isNativePlatform()) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now() % 2147483000,
          title: WEB_NOTIFICATION_TITLE,
          body: WEB_NOTIFICATION_BODY,
          schedule: { at: new Date(Date.now() + 250) },
        },
      ],
    })
    return
  }

  if ('Notification' in window) {
    // Web local notification for browsers with granted permission.
    new Notification(WEB_NOTIFICATION_TITLE, { body: WEB_NOTIFICATION_BODY })
  }
}
