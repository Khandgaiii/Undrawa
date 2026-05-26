'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  clearDeviceBaseUrl,
  discoverDevice,
  fetchDeviceStatus,
  getDeviceBaseUrl,
  setDeviceBaseUrl,
  setDeviceRelay,
  type DeviceStatus,
} from '@/lib/device-api'

const POLL_MS = 2000

interface UseUndrawaDeviceOptions {
  enabled?: boolean
}

export function useUndrawaDevice(options: UseUndrawaDeviceOptions = {}) {
  const { enabled = true } = options
  const [baseUrl, setBaseUrl] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [discovering, setDiscovering] = useState(false)
  const [status, setStatus] = useState<DeviceStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const relayPending = useRef(false)
  const failCount = useRef(0)

  useEffect(() => {
    setBaseUrl(getDeviceBaseUrl())
  }, [])

  const poll = useCallback(async () => {
    const url = getDeviceBaseUrl()
    if (!url) {
      setConnected(false)
      setStatus(null)
      return
    }
    try {
      const data = await fetchDeviceStatus(url)
      setStatus(data)
      setConnected(true)
      setError(null)
      failCount.current = 0
    } catch {
      failCount.current += 1
      setConnected(false)
      setError('Connection failed')
    }
  }, [])

  const runDiscovery = useCallback(async () => {
    setDiscovering(true)
    setError(null)
    try {
      const found = await discoverDevice()
      if (found) {
        setBaseUrl(found)
        await poll()
        return true
      }
      setError('No Undrawa device found on this network')
      return false
    } finally {
      setDiscovering(false)
    }
  }, [poll])

  useEffect(() => {
    if (!enabled) return
    let cancelled = false

    const connect = async () => {
      const saved = getDeviceBaseUrl()
      if (saved) {
        setBaseUrl(saved)
        return
      }
      if (!cancelled) await runDiscovery()
    }

    void connect()
    return () => {
      cancelled = true
    }
  }, [enabled, runDiscovery])

  useEffect(() => {
    if (!enabled || !baseUrl) return
    poll()
    const id = setInterval(poll, POLL_MS)
    return () => clearInterval(id)
  }, [enabled, baseUrl, poll])

  useEffect(() => {
    if (!enabled || !baseUrl || connected || discovering) return
    if (failCount.current < 3) return
    const id = setTimeout(() => {
      failCount.current = 0
      void runDiscovery()
    }, 5000)
    return () => clearTimeout(id)
  }, [enabled, baseUrl, connected, discovering, runDiscovery])

  const connectManual = useCallback(
    async (url: string) => {
      const trimmed = url.trim().replace(/\/$/, '')
      if (!trimmed) return false
      setDeviceBaseUrl(trimmed)
      setBaseUrl(trimmed)
      failCount.current = 0
      try {
        await fetchDeviceStatus(trimmed)
        await poll()
        return true
      } catch {
        setError('Connection failed')
        setConnected(false)
        return false
      }
    },
    [poll]
  )

  const disconnect = useCallback(() => {
    clearDeviceBaseUrl()
    setBaseUrl(null)
    setConnected(false)
    setStatus(null)
    setError(null)
    failCount.current = 0
  }, [])

  const setRelay = useCallback(async (engaged: boolean) => {
    const url = getDeviceBaseUrl()
    if (!url || relayPending.current) return false
    relayPending.current = true
    try {
      const data = await setDeviceRelay(url, engaged)
      setStatus(data)
      setConnected(true)
      setError(null)
      return true
    } catch {
      setError('Relay command failed')
      return false
    } finally {
      relayPending.current = false
    }
  }, [])

  return {
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
  }
}
