'use client'

import { useMemo, useState } from 'react'
import { Droplet, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Capacitor } from '@capacitor/core'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type Translations } from '@/lib/translations'

interface AuthScreenProps {
  onLogin: () => void
  onGoogleLogin?: () => Promise<void> | void
  t: Translations
}

export function AuthScreen({ onLogin, onGoogleLogin, t }: AuthScreenProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const isNativeApp = useMemo(() => {
    if (typeof window === 'undefined') return false
    const url = window.location.href
    const host = window.location.hostname
    const protocol = window.location.protocol
    const ua = navigator.userAgent
    const runningInWebView = /\bwv\b/i.test(ua) || /; wv\)/i.test(ua)
    const runningFromCapacitorHost =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      protocol === 'capacitor:' ||
      protocol === 'file:' ||
      url.startsWith('https://localhost')
    const hasCapacitorBridge =
      typeof (window as { Capacitor?: unknown }).Capacitor !== 'undefined'
    return (
      Capacitor.getPlatform() !== 'web' ||
      Capacitor.isNativePlatform() ||
      runningInWebView ||
      runningFromCapacitorHost ||
      hasCapacitorBridge
    )
  }, [])
  const isMobileBrowser = useMemo(() => {
    if (typeof window === 'undefined') return false
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  }, [])
  const showGoogleLogin = !isNativeApp && !isMobileBrowser && Boolean(onGoogleLogin)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  const handleGoogleSignIn = async () => {
    if (!onGoogleLogin || isNativeApp || googleLoading) return
    setGoogleLoading(true)
    try {
      await onGoogleLogin()
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-spin-slow" />
      </div>

      <div className="w-full max-w-md relative animate-slide-up">
        {/* Logo header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Droplet className="h-12 w-12 text-primary animate-float animate-glow" />
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg animate-pulse" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {t.logo}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">{t.tagline}</p>
        </div>

        {/* Auth Card */}
        <div className="glass-strong rounded-2xl p-6 shadow-xl animate-scale-in card-hover" style={{ animationDelay: '0.2s' }}>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="rounded-lg">
                {t.login}
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg">
                {t.signup}
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    {t.welcomeBack}
                  </h2>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-email">{t.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      className="pl-10 bg-background/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">{t.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-background/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25">
                  {t.loginButton}
                </Button>
                {showGoogleLogin && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                  >
                    {googleLoading ? 'Signing in...' : 'Sign in with Google'}
                  </Button>
                )}
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    {t.createAccount}
                  </h2>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      className="pl-10 bg-background/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t.password}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-background/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">{t.confirmPassword}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-background/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25">
                  {t.signupButton}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
