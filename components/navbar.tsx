'use client'

import { useTheme } from 'next-themes'
import { Droplet, Globe, Moon, Sun, Wifi, Phone, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Language, languageNames, type Translations } from '@/lib/translations'

interface NavbarProps {
  isAuthenticated: boolean
  language: Language
  onLanguageChange: (lang: Language) => void
  esp32Online: boolean
  sim900Online: boolean
  t: Translations
  onLogout: () => void
}

export function Navbar({
  isAuthenticated,
  language,
  onLanguageChange,
  esp32Online,
  sim900Online,
  t,
  onLogout,
}: NavbarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 glass-strong safe-area-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 group">
            <div className="relative">
              <Droplet className="h-7 w-7 text-primary animate-float animate-glow" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-primary">
              {t.logo}
            </span>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Connection status badges (only when authenticated) */}
            {isAuthenticated && (
              <div className="hidden sm:flex items-center gap-2">
                {/* ESP32 Status */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    esp32Online
                      ? 'bg-success/20 text-success border border-success/30 pulse-success'
                      : 'bg-destructive/20 text-destructive border border-destructive/30'
                  }`}
                >
                  <Wifi className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">{t.esp32Label}</span>
                </div>

                {/* SIM900 Status */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    sim900Online
                      ? 'bg-success/20 text-success border border-success/30 pulse-success'
                      : 'bg-destructive/20 text-destructive border border-destructive/30'
                  }`}
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">{t.sim900Label}</span>
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9 rounded-full hover:scale-110 transition-transform duration-200"
              aria-label={t.themeToggle}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">{t.language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-strong">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => onLanguageChange(lang)}
                    className={language === lang ? 'bg-primary/20 text-primary' : ''}
                  >
                    {languageNames[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Logout button (only when authenticated) */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive"
                aria-label={t.logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
