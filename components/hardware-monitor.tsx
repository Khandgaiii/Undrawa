'use client'

import { Wifi, WifiOff, Phone, PhoneOff, Cpu, Signal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Translations } from '@/lib/translations'

interface HardwareMonitorProps {
  esp32Online: boolean
  sim900Online: boolean
  liveDevice: boolean
  t: Translations
}

export function HardwareMonitor({
  esp32Online,
  sim900Online,
  liveDevice,
  t,
}: HardwareMonitorProps) {
  return (
    <section className="space-y-4 animate-slide-up">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Cpu className="h-5 w-5 text-primary animate-icon-pulse" />
        {t.hardwareMonitor}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass overflow-hidden card-hover animate-fade-in stagger-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.esp32CoreState}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${
                  esp32Online
                    ? 'bg-success/20 text-success pulse-success'
                    : 'bg-destructive/20 text-destructive'
                }`}
              >
                {esp32Online ? <Wifi className="h-8 w-8" /> : <WifiOff className="h-8 w-8" />}
              </div>
              <div>
                <p
                  className={`text-lg font-semibold ${
                    esp32Online ? 'text-success' : 'text-destructive'
                  }`}
                >
                  {t.esp32Label}: {liveDevice && esp32Online ? t.connected : t.offline}
                </p>
                <p className="text-sm text-muted-foreground">
                  {liveDevice && esp32Online ? t.working : t.notWorking}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass overflow-hidden card-hover animate-fade-in stagger-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.sim900Module}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${
                  sim900Online
                    ? 'bg-success/20 text-success pulse-success'
                    : 'bg-destructive/20 text-destructive'
                }`}
              >
                {sim900Online ? <Phone className="h-8 w-8" /> : <PhoneOff className="h-8 w-8" />}
              </div>
              <div>
                <p
                  className={`text-lg font-semibold ${
                    sim900Online ? 'text-success' : 'text-destructive'
                  }`}
                >
                  {t.sim900Label}: {liveDevice && sim900Online ? t.connected : t.offline}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Signal className="h-3 w-3" />
                  {liveDevice && sim900Online ? t.smsAlertReady : t.smsAlertNotReady}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
