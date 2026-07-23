import type { SupportedLocalesConfig } from '../localization/forward-exports'
import type { SupportedThemesConfig } from '../theme/ThemeProvider'

export const HightideConfigUtils = {
  defaultSupportedLocales: {
    'de-DE': { localName: 'Deutsch' },
    'en-US': { localName: 'English (US)' },
  } as const satisfies SupportedLocalesConfig,
  defaultSupportedThemes: {
    light: {
      nameTranslations: {
        'de-DE': 'Hell',
        'en-US': 'Light',
      },
    },
    dark: {
      nameTranslations: {
        'de-DE': 'Dunkel',
        'en-US': 'Dark',
      },
    },
  } as const satisfies SupportedThemesConfig,
}
