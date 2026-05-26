import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.waterleak.dashboard',
  appName: 'Undrawa',
  webDir: 'out',
  android: {
    allowMixedContent: true,
    adjustMarginsForEdgeToEdge: 'disable',
  },
  server: {
    androidScheme: 'https',
  },
}

export default config
