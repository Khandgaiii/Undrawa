'use client'

import { ShieldCheck, ShieldAlert, Droplets, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { type Translations } from '@/lib/translations'

interface LeakDetectionProps {
  isLeaking: boolean
  t: Translations
  waterLevelPercent?: number | null
  liveDevice?: boolean
  lowWater?: boolean
  smsSent?: boolean
  onClearAlert?: () => void
}

export function LeakDetection({
  isLeaking,
  t,
  waterLevelPercent = null,
  liveDevice = false,
  lowWater = false,
  smsSent = false,
  onClearAlert,
}: LeakDetectionProps) {
  const showLeak = liveDevice && isLeaking
  const showNormal = liveDevice && !isLeaking
  const levelDisplay =
    liveDevice && waterLevelPercent != null
      ? `${waterLevelPercent.toFixed(0)}${t.percent}`
      : '—'

  return (
    <section className="space-y-4 animate-slide-up stagger-2">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary animate-icon-pulse" />
        {t.leakDetection} & {t.telemetry}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card
          className={`lg:col-span-2 overflow-hidden transition-all duration-500 ${
            showLeak
              ? 'border-destructive bg-destructive/10 pulse-alert'
              : 'glass border-success/30 card-hover'
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.leakWarning}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              {showLeak ? (
                <>
                  <div className="relative">
                    <ShieldAlert className="h-20 w-20 text-destructive animate-bounce" />
                    <div className="absolute inset-0 bg-destructive/30 rounded-full blur-xl animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-2xl font-bold text-destructive animate-pulse">
                      {t.criticalWarning}
                    </p>
                    <p className="text-lg text-destructive/90">{t.waterLeakDetected}</p>
                    <p className="text-sm text-muted-foreground">
                      {smsSent ? t.smsSent : t.smsPending}
                    </p>
                  </div>
                  {onClearAlert && (
                    <Button variant="outline" size="sm" onClick={onClearAlert}>
                      {t.clearAlert}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <div className="relative">
                    <ShieldCheck className="h-20 w-20 text-success animate-float" />
                    <div className="absolute inset-0 bg-success/20 rounded-full blur-xl animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">
                      {showNormal ? t.statusNotLeaked : t.deviceOffline}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {showNormal
                        ? `${t.waterLevel}: ${levelDisplay}`
                        : t.connectDeviceToControl}
                    </p>
                    {showNormal && lowWater && (
                      <p className="text-sm text-warning mt-1">{t.lowWater}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass overflow-hidden card-hover animate-fade-in stagger-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t.waterLevelTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 gap-4">
              <div
                className={`p-4 rounded-xl transition-all duration-500 ${
                  showLeak || (showNormal && lowWater)
                    ? 'bg-destructive/20 text-destructive'
                    : 'bg-primary/20 text-primary animate-float'
                }`}
              >
                <Droplets className="h-10 w-10" />
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {t.waterLevel}
                </p>
                <p
                  className={`text-4xl font-mono font-bold tabular-nums ${
                    showNormal && lowWater ? 'text-destructive' : 'text-foreground'
                  }`}
                >
                  {levelDisplay}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
