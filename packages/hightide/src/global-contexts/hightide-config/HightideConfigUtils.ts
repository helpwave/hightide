import type { LocaleInformation } from '../localization/forward-exports'
import type { SupportedThemesConfig } from '../theme'

export const HightideConfigUtils = {
  defaultSupportedLocales: [
    { locale: 'de-DE', localName: 'Deutsch' },
    { locale: 'en-US', localName: 'English (US)' },
  ] as const satisfies readonly LocaleInformation[],
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
