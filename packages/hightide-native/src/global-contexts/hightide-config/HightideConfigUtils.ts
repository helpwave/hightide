import type { LocaleInformation } from '../localization/forward-exports'
import type { ThemeInformation } from '../theme/forward-exports'

export const HightideConfigUtils = {
  defaultSupportedLocales: [
    { locale: 'de-DE', localName: 'Deutsch' },
    { locale: 'en-US', localName: 'English (US)' },
  ] as const satisfies readonly LocaleInformation[],
  defaultSupportedThemes: [
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
  ] as const satisfies readonly ThemeInformation[],
}
