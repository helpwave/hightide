import type { ThemeInformation } from './useCreateThemeConfig'

export const HightideSupportedThemeInformation = {
  light: {
    name: 'Light',
    isDark: false,
    translationKey: 'themeNameLight',
  },
  dark: {
    name: 'Dark',
    isDark: true,
    translationKey: 'themeNameDark',
  },
} as const satisfies Record<string, Omit<ThemeInformation, 'theme'>>
