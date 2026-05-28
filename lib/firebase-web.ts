'use client'

import { Capacitor } from '@capacitor/core'
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAyXGYhn3GrWzDxtnTw4UZFacj0JtCW-6o',
  authDomain: 'undrawa.firebaseapp.com',
  projectId: 'undrawa',
  storageBucket: 'undrawa.firebasestorage.app',
  messagingSenderId: '1081194421423',
  appId: '1:1081194421423:web:c74c83045893ee4265085a',
  measurementId: 'G-K85TBJF5P3',
}

let analyticsInitialized = false

function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApps()[0]
  }
  return initializeApp(firebaseConfig)
}

export async function signInWithGoogleWeb(): Promise<User | null> {
  if (Capacitor.isNativePlatform()) return null

  const app = getFirebaseApp()
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()

  if (!analyticsInitialized) {
    analyticsInitialized = true
    const supported = await analyticsSupported()
    if (supported) {
      getAnalytics(app)
    }
  }

  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch {
    return null
  }
}
