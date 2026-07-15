import type { ThemeInformation } from '@helpwave/hightide-utils'

export const defaultSupportedThemes: readonly ThemeInformation[] = [
  {
    theme: 'light',
    nameTranslations: {
      'de-DE': 'Hell',
      'en-US': 'Light',
    },
  },
  {
    theme: 'dark',
    nameTranslations: {
      'de-DE': 'Dunkel',
      'en-US': 'Dark',
    },
  },
  {
    theme: 'system',
    nameTranslations: {
      'de-DE': 'System',
      'en-US': 'System',
    },
  },
]
