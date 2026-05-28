'use client'

import { Capacitor } from '@capacitor/core'
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics'
import {
  type AuthError,
  getAuth,
  GoogleAuthProvider,
  getRedirectResult,
  signInWithRedirect,
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

export interface GoogleSignInResult {
  user: User | null
  redirectStarted: boolean
  errorMessage: string | null
}

function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApps()[0]
  }
  return initializeApp(firebaseConfig)
}

function getFriendlyAuthError(err: AuthError): string {
  switch (err.code) {
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing login.'
    case 'auth/popup-blocked':
      return 'Popup blocked by browser. Allow popups for this site and try again.'
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Auth settings.'
    case 'auth/operation-not-allowed':
      return 'Google provider is not enabled in Firebase Authentication.'
    default:
      return err.message || 'Google sign-in failed. Please try again.'
  }
}

async function ensureFirebaseReady() {
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

  return { auth, provider }
}

export async function completeGoogleRedirectWeb(): Promise<User | null> {
  if (Capacitor.isNativePlatform()) return null

  const { auth } = await ensureFirebaseReady()
  try {
    const result = await getRedirectResult(auth)
    return result?.user ?? null
  } catch {
    return null
  }
}

export async function signInWithGoogleWeb(): Promise<GoogleSignInResult> {
  if (Capacitor.isNativePlatform()) {
    return {
      user: null,
      redirectStarted: false,
      errorMessage: 'Google sign-in is only supported on web.',
    }
  }

  const { auth, provider } = await ensureFirebaseReady()

  try {
    const result = await signInWithPopup(auth, provider)
    return {
      user: result.user,
      redirectStarted: false,
      errorMessage: null,
    }
  } catch (error) {
    const authError = error as AuthError
    if (
      authError.code === 'auth/popup-blocked' ||
      authError.code === 'auth/operation-not-supported-in-this-environment'
    ) {
      await signInWithRedirect(auth, provider)
      return {
        user: null,
        redirectStarted: true,
        errorMessage: null,
      }
    }

    return {
      user: null,
      redirectStarted: false,
      errorMessage: getFriendlyAuthError(authError),
    }
  }
}
