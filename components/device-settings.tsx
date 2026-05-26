'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff, Link2, Loader2, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DISCOVERY_URLS } from '@/lib/device-api'
import { type Translations, translateDeviceError } from '@/lib/translations'

interface DeviceSettingsProps {
  connected: boolean
  discovering: boolean
  baseUrl: string | null
  error: string | null
  t: Translations
  onConnect: (url: string) => Promise<boolean>
  onDiscover: () => Promise<boolean>
  onDisconnect: () => void
}

export function DeviceSettings({
  connected,
  discovering,
  baseUrl,
  error,
  t,
  onConnect,
  onDiscover,
  onDisconnect,
}: DeviceSettingsProps) {
  const [input, setInput] = useState(baseUrl ?? DISCOVERY_URLS[0])
  const [connecting, setConnecting] = useState(false)
  const displayError = translateDeviceError(error, t)

  useEffect(() => {
    if (baseUrl) setInput(baseUrl)
  }, [baseUrl])

  const handleConnect = async () => {
    setConnecting(true)
    await onConnect(input)
    setConnecting(false)
  }

  const handleDiscover = async () => {
    setConnecting(true)
    await onDiscover()
    setConnecting(false)
  }

  const busy = discovering || connecting

  if (connected && baseUrl) {
    return (
      <Card className="glass border-success/30 animate-fade-in">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-success/20 text-success">
                <Wifi className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-success">{t.deviceConnected}</p>
                <p className="text-xs text-muted-foreground font-mono">{baseUrl}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onDisconnect}>
              {t.deviceDisconnect}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Link2 className="h-4 w-4" />
          {t.deviceLinkTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">{t.deviceHint}</p>

        {busy && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.deviceSearching}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="http://undrawa.local"
            className="font-mono text-sm"
            disabled={busy}
          />
          <Button onClick={handleConnect} disabled={busy} className="shrink-0 gap-2">
            {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t.deviceConnect}
          </Button>
          <Button
            variant="secondary"
            onClick={handleDiscover}
            disabled={busy}
            className="shrink-0 gap-2"
          >
            <Search className="h-4 w-4" />
            {t.deviceFind}
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {displayError ? (
            <>
              <WifiOff className="h-4 w-4 text-destructive shrink-0" />
              <span className="text-destructive">{displayError}</span>
            </>
          ) : (
            <span className="text-muted-foreground">{t.deviceSetupHint}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
