'use client'

import { Power, Droplet, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { type Translations } from '@/lib/translations'

interface ControlCenterProps {
  relayEngaged: boolean
  onRelayToggle: (engaged: boolean) => void
  t: Translations
  disabled?: boolean
}

export function ControlCenter({
  relayEngaged,
  onRelayToggle,
  t,
  disabled = false,
}: ControlCenterProps) {
  const valveClosed = relayEngaged

  return (
    <section className="space-y-4 animate-slide-up stagger-3">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Power className="h-5 w-5 text-primary animate-icon-pulse" />
        {t.controlCenter}
      </h2>

      {disabled && (
        <p className="text-sm text-muted-foreground">{t.connectDeviceToControl}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass overflow-hidden card-hover animate-fade-in stagger-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.relayControl}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl transition-all duration-500 ${
                    relayEngaged
                      ? 'bg-destructive/20 text-destructive animate-pulse'
                      : 'bg-success/20 text-success'
                  }`}
                >
                  <Power className="h-8 w-8" />
                </div>
                <div>
                  <p
                    className={`text-lg font-semibold ${
                      relayEngaged ? 'text-destructive' : 'text-success'
                    }`}
                  >
                    {relayEngaged ? t.relayEngaged : t.relayDisengaged}
                  </p>
                  <p className="text-sm text-muted-foreground">{t.relayModule}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="relay-toggle" className="sr-only">
                  {t.relayControl}
                </Label>
                <Switch
                  id="relay-toggle"
                  checked={relayEngaged}
                  disabled={disabled}
                  onCheckedChange={onRelayToggle}
                  className={`scale-150 ${relayEngaged ? 'data-[state=checked]:bg-destructive' : ''}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass overflow-hidden card-hover animate-fade-in stagger-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.valveStatus}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 py-4">
              <div
                className={`p-3 rounded-xl transition-all duration-500 ${
                  valveClosed
                    ? 'bg-destructive/20 text-destructive'
                    : 'bg-success/20 text-success'
                }`}
              >
                {valveClosed ? (
                  <XCircle className="h-8 w-8 animate-pulse" />
                ) : (
                  <Droplet className="h-8 w-8 animate-float" />
                )}
              </div>
              <div>
                <p
                  className={`text-lg font-semibold ${
                    valveClosed ? 'text-destructive' : 'text-success'
                  }`}
                >
                  {valveClosed ? t.valveClosed : t.valveOpen}
                </p>
                <p
                  className={`text-sm ${
                    valveClosed ? 'text-destructive/80' : 'text-success/80'
                  }`}
                >
                  {valveClosed ? t.waterTerminated : t.flowing}
                </p>
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  valveClosed
                    ? 'w-0 bg-destructive'
                    : 'w-full bg-gradient-to-r from-primary via-accent to-success'
                }`}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
