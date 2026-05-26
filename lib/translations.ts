export type Language = 'en' | 'ja' | 'mn'

export interface Translations {
  logo: string
  tagline: string
  themeToggle: string
  language: string
  connected: string
  working: string
  offline: string
  notWorking: string

  login: string
  signup: string
  email: string
  password: string
  confirmPassword: string
  loginButton: string
  signupButton: string
  welcomeBack: string
  createAccount: string
  emailPlaceholder: string

  dashboard: string
  dashboardLive: string
  dashboardWaiting: string
  footerTitle: string
  footerSubtitle: string
  logout: string

  deviceLinkTitle: string
  deviceConnected: string
  deviceSearching: string
  deviceHint: string
  deviceSetupHint: string
  deviceConnect: string
  deviceFind: string
  deviceDisconnect: string
  deviceOffline: string
  deviceNotFound: string
  deviceRelayFailed: string

  hardwareMonitor: string
  esp32CoreState: string
  sim900Module: string
  cellularNetwork: string
  smsAlertReady: string
  smsAlertNotReady: string
  esp32Label: string
  sim900Label: string

  leakDetection: string
  telemetry: string
  leakWarning: string
  statusNotLeaked: string
  criticalWarning: string
  waterLeakDetected: string
  systemNormal: string
  waterLevel: string
  smsSent: string
  smsPending: string
  volumeMetric: string
  waterLevelTitle: string
  lowWater: string
  percent: string
  clearAlert: string

  controlCenter: string
  relayModule: string
  relayControl: string
  relayEngaged: string
  relayDisengaged: string
  valveStatus: string
  valveOpen: string
  valveClosed: string
  flowing: string
  waterTerminated: string
  connectDeviceToControl: string
}

export const translations: Record<Language, Translations> = {
  en: {
    logo: 'Undrawa',
    tagline: 'IoT water security — leak detection & valve control',
    themeToggle: 'Toggle theme',
    language: 'Language',
    connected: 'Connected',
    working: 'Online',
    offline: 'Offline',
    notWorking: 'Unavailable',

    login: 'Log in',
    signup: 'Sign up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    loginButton: 'Sign in',
    signupButton: 'Create account',
    welcomeBack: 'Welcome back',
    createAccount: 'Create your account',
    emailPlaceholder: 'you@example.com',

    dashboard: 'Dashboard',
    dashboardLive: 'Live data from ESP32 & SIM900',
    dashboardWaiting: 'Connect your ESP32 on the same Wi‑Fi',
    footerTitle: 'Undrawa IoT Water Security',
    footerSubtitle: 'ESP32 · SIM900 SMS · Wi‑Fi',
    logout: 'Log out',

    deviceLinkTitle: 'Device connection',
    deviceConnected: 'Connected to ESP32',
    deviceSearching: 'Searching for Undrawa device…',
    deviceHint: 'Phone and ESP32 must use the same Wi‑Fi. Auto-search: undrawa.local',
    deviceSetupHint: 'Upload firmware with your Wi‑Fi in config.h, then connect.',
    deviceConnect: 'Connect',
    deviceFind: 'Find device',
    deviceDisconnect: 'Disconnect',
    deviceOffline: 'Device unreachable',
    deviceNotFound: 'No Undrawa device found on this network',
    deviceRelayFailed: 'Could not control relay',

    hardwareMonitor: 'Hardware monitor',
    esp32CoreState: 'ESP32',
    sim900Module: 'SIM900 cellular',
    cellularNetwork: 'Mobile network',
    smsAlertReady: 'SMS alerts ready',
    smsAlertNotReady: 'SMS not ready',
    esp32Label: 'ESP32',
    sim900Label: 'SIM900',

    leakDetection: 'Leak detection',
    telemetry: 'Telemetry',
    leakWarning: 'Leak status',
    statusNotLeaked: 'No leak detected',
    criticalWarning: 'Critical alert',
    waterLeakDetected: 'Water leak detected',
    systemNormal: 'System normal',
    waterLevel: 'Water level',
    smsSent: 'SMS alert sent',
    smsPending: 'Sending SMS alert…',
    volumeMetric: 'Water level',
    waterLevelTitle: 'Tank level',
    lowWater: 'Low water level',
    percent: '%',
    clearAlert: 'Clear alert',

    controlCenter: 'Control center',
    relayModule: 'Relay module',
    relayControl: 'Relay & valve',
    relayEngaged: 'Relay on — valve closed',
    relayDisengaged: 'Relay off — valve open',
    valveStatus: 'Valve',
    valveOpen: 'Valve open',
    valveClosed: 'Valve closed',
    flowing: 'Water flowing',
    waterTerminated: 'Water supply stopped',
    connectDeviceToControl: 'Connect ESP32 to control the valve',
  },
  ja: {
    logo: 'Undrawa',
    tagline: 'IoT水セキュリティ — 漏水検知とバルブ制御',
    themeToggle: 'テーマ切替',
    language: '言語',
    connected: '接続済み',
    working: 'オンライン',
    offline: 'オフライン',
    notWorking: '利用不可',

    login: 'ログイン',
    signup: '新規登録',
    email: 'メール',
    password: 'パスワード',
    confirmPassword: 'パスワード（確認）',
    loginButton: 'ログイン',
    signupButton: 'アカウント作成',
    welcomeBack: 'おかえりなさい',
    createAccount: 'アカウントを作成',
    emailPlaceholder: 'you@example.com',

    dashboard: 'ダッシュボード',
    dashboardLive: 'ESP32・SIM900 からリアルタイム表示',
    dashboardWaiting: '同じWi‑FiでESP32に接続してください',
    footerTitle: 'Undrawa IoT 水セキュリティ',
    footerSubtitle: 'ESP32 · SIM900 SMS · Wi‑Fi',
    logout: 'ログアウト',

    deviceLinkTitle: 'デバイス接続',
    deviceConnected: 'ESP32に接続済み',
    deviceSearching: 'Undrawaデバイスを検索中…',
    deviceHint: 'スマホとESP32は同じWi‑Fiが必要です。自動検索: undrawa.local',
    deviceSetupHint: 'config.hにWi‑Fiを設定してファームウェアを書き込んでください。',
    deviceConnect: '接続',
    deviceFind: 'デバイスを探す',
    deviceDisconnect: '切断',
    deviceOffline: 'デバイスに到達できません',
    deviceNotFound: 'このネットワークにUndrawaデバイスが見つかりません',
    deviceRelayFailed: 'リレーを制御できませんでした',

    hardwareMonitor: 'ハードウェア監視',
    esp32CoreState: 'ESP32',
    sim900Module: 'SIM900 セルラー',
    cellularNetwork: 'モバイルネットワーク',
    smsAlertReady: 'SMS通知 準備完了',
    smsAlertNotReady: 'SMS 未準備',
    esp32Label: 'ESP32',
    sim900Label: 'SIM900',

    leakDetection: '漏水検知',
    telemetry: 'テレメトリ',
    leakWarning: '漏水状態',
    statusNotLeaked: '漏水なし',
    criticalWarning: '重大な警告',
    waterLeakDetected: '漏水を検出しました',
    systemNormal: '正常稼働中',
    waterLevel: '水位',
    smsSent: 'SMS通知を送信しました',
    smsPending: 'SMS送信中…',
    volumeMetric: '水位',
    waterLevelTitle: 'タンク水位',
    lowWater: '低水位',
    percent: '%',
    clearAlert: '警報を解除',

    controlCenter: '制御センター',
    relayModule: 'リレー',
    relayControl: 'リレー・バルブ',
    relayEngaged: 'リレーON — バルブ閉',
    relayDisengaged: 'リレーOFF — バルブ開',
    valveStatus: 'バルブ',
    valveOpen: 'バルブ開',
    valveClosed: 'バルブ閉',
    flowing: '通水中',
    waterTerminated: '給水停止',
    connectDeviceToControl: 'ESP32に接続してバルブを操作',
  },
  mn: {
    logo: 'Undrawa',
    tagline: 'IoT усны аюулгүй байдал — ус алдалт илрүүлэх, хаалт удирдах',
    themeToggle: 'Загвар солих',
    language: 'Хэл',
    connected: 'Холбогдсон',
    working: 'Онлайн',
    offline: 'Офлайн',
    notWorking: 'Боломжгүй',

    login: 'Нэвтрэх',
    signup: 'Бүртгүүлэх',
    email: 'Имэйл',
    password: 'Нууц үг',
    confirmPassword: 'Нууц үг давтах',
    loginButton: 'Нэвтрэх',
    signupButton: 'Бүртгэл үүсгэх',
    welcomeBack: 'Тавтай морил',
    createAccount: 'Бүртгэл үүсгэх',
    emailPlaceholder: 'you@example.com',

    dashboard: 'Хяналтын самбар',
    dashboardLive: 'ESP32 болон SIM900-оос шууд өгөгдөл',
    dashboardWaiting: 'ESP32-той ижил Wi‑Fi-д холбоно уу',
    footerTitle: 'Undrawa IoT усны аюулгүй байдал',
    footerSubtitle: 'ESP32 · SIM900 SMS · Wi‑Fi',
    logout: 'Гарах',

    deviceLinkTitle: 'Төхөөрөмж холболт',
    deviceConnected: 'ESP32 холбогдсон',
    deviceSearching: 'Undrawa төхөөрөмж хайж байна…',
    deviceHint: 'Утас болон ESP32 нэг Wi‑Fi дээр байх ёстой. Авто хайлт: undrawa.local',
    deviceSetupHint: 'config.h-д Wi‑Fi тохируулж firmware ачаална уу.',
    deviceConnect: 'Холбох',
    deviceFind: 'Төхөөрөмж хайх',
    deviceDisconnect: 'Салгах',
    deviceOffline: 'Төхөөрөмж хүрэхгүй байна',
    deviceNotFound: 'Энэ сүлжээнд Undrawa төхөөрөмж олдсонгүй',
    deviceRelayFailed: 'Реле удирдаж чадсангүй',

    hardwareMonitor: 'Техник хангамж',
    esp32CoreState: 'ESP32',
    sim900Module: 'SIM900 үүрэн',
    cellularNetwork: 'Үүрэн сүлжээ',
    smsAlertReady: 'SMS бэлэн',
    smsAlertNotReady: 'SMS бэлэн биш',
    esp32Label: 'ESP32',
    sim900Label: 'SIM900',

    leakDetection: 'Ус алдалт илрүүлэх',
    telemetry: 'Телеметр',
    leakWarning: 'Ус алдалтын төлөв',
    statusNotLeaked: 'Ус алдалт илрээгүй',
    criticalWarning: 'Ноцтой анхааруулга',
    waterLeakDetected: 'Ус алдалт илэрлээ',
    systemNormal: 'Хэвийн ажиллаж байна',
    waterLevel: 'Усны түвшин',
    smsSent: 'SMS илгээгдлээ',
    smsPending: 'SMS илгээж байна…',
    volumeMetric: 'Усны түвшин',
    waterLevelTitle: 'Савны түвшин',
    lowWater: 'Усны түвшин бага',
    percent: '%',
    clearAlert: 'Дохиолол арилгах',

    controlCenter: 'Удирдлага',
    relayModule: 'Реле',
    relayControl: 'Реле ба хаалт',
    relayEngaged: 'Реле асаалттай — хаалт хаагдсан',
    relayDisengaged: 'Реле унтраалттай — хаалт нээлттэй',
    valveStatus: 'Хаалт',
    valveOpen: 'Хаалт нээлттэй',
    valveClosed: 'Хаалт хаалттай',
    flowing: 'Ус урсаж байна',
    waterTerminated: 'Ус зогсоосон',
    connectDeviceToControl: 'Хаалт удирдахын тулд ESP32 холбоно уу',
  },
}

export const languageNames: Record<Language, string> = {
  en: 'English',
  ja: '日本語',
  mn: 'Монгол',
}

export function translateDeviceError(
  message: string | null,
  t: Translations
): string | null {
  if (!message) return null
  if (message.includes('No Undrawa')) return t.deviceNotFound
  if (message.includes('Relay')) return t.deviceRelayFailed
  if (message.includes('Connection failed') || message.includes('unreachable'))
    return t.deviceOffline
  return message
}
