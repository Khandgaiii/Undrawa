export interface DeviceStatus {
  device: string
  hostName?: string
  ipAddress?: string
  esp32Online: boolean
  sim900Online: boolean
  isLeaking: boolean
  relayEngaged: boolean
  valveClosed: boolean
  waterLevelPercent: number
  waterLevelRaw: number
  lowWater: boolean
  smsSent: boolean
  uptimeMs: number
}

const DEVICE_URL_KEY = 'undrawa-device-url'
const FETCH_TIMEOUT_MS = 4000

/** URLs tried when auto-connecting phone app ↔ ESP32 */
export const DISCOVERY_URLS = [
  'http://undrawa.local',
  'http://undrawa',
] as const

export function getDeviceBaseUrl(): string | null {
  if (typeof window === 'undefined') return null
  const url = localStorage.getItem(DEVICE_URL_KEY)?.trim()
  return url || null
}

export function setDeviceBaseUrl(url: string): void {
  localStorage.setItem(DEVICE_URL_KEY, url.replace(/\/$/, ''))
}

export function clearDeviceBaseUrl(): void {
  localStorage.removeItem(DEVICE_URL_KEY)
}

async function fetchWithTimeout(
  url: string,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: 'no-store',
    })
  } finally {
    clearTimeout(timer)
  }
}

function isUndrawaDevice(data: { device?: string }): boolean {
  return data.device === 'Undrawa'
}

/** Find ESP32 on local WiFi (mDNS or saved IP). */
export async function discoverDevice(
  extraUrls: string[] = []
): Promise<string | null> {
  const saved = getDeviceBaseUrl()
  const candidates = [
    ...(saved ? [saved] : []),
    ...DISCOVERY_URLS,
    ...extraUrls,
  ]
  const seen = new Set<string>()

  for (const base of candidates) {
    const normalized = base.replace(/\/$/, '')
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)

    try {
      const res = await fetchWithTimeout(`${normalized}/api/ping`)
      if (!res.ok) continue
      const data = (await res.json()) as { device?: string; ok?: boolean }
      if (data.ok && isUndrawaDevice(data)) {
        setDeviceBaseUrl(normalized)
        return normalized
      }
    } catch {
      try {
        const data = await fetchDeviceStatus(normalized)
        if (isUndrawaDevice(data)) {
          setDeviceBaseUrl(normalized)
          return normalized
        }
      } catch {
        /* try next */
      }
    }
  }

  return null
}

export async function fetchDeviceStatus(baseUrl: string): Promise<DeviceStatus> {
  const res = await fetchWithTimeout(`${baseUrl}/api/status`)
  if (!res.ok) throw new Error(`Status ${res.status}`)
  const data = (await res.json()) as DeviceStatus
  if (!isUndrawaDevice(data)) throw new Error('Not an Undrawa device')
  return data
}

export async function setDeviceRelay(
  baseUrl: string,
  engaged: boolean
): Promise<DeviceStatus> {
  const res = await fetchWithTimeout(`${baseUrl}/api/relay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ engaged }),
  })
  if (!res.ok) throw new Error(`Relay ${res.status}`)
  return res.json() as Promise<DeviceStatus>
}

export async function resetDeviceLeak(baseUrl: string): Promise<DeviceStatus> {
  const res = await fetchWithTimeout(`${baseUrl}/api/reset-leak`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error(`Reset ${res.status}`)
  return res.json() as Promise<DeviceStatus>
}
