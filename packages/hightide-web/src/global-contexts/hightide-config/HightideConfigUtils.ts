import type { SupportedLocalesConfig } from '../localization/forward-exports'
import type { SupportedThemesConfig } from '../theme/ThemeProvider'

export const HightideConfigUtils = {
  defaultSupportedLocales: {
    'de-DE': {
      localName: 'Deutsch',
      defaultIs24HourFormat: true,
      defaultStartingWeekday: 'monday',
      defaultCalendarType: 'Gregorian',
    },
    'en-US': {
      localName: 'English (US)',
      defaultIs24HourFormat: false,
      defaultStartingWeekday: 'sunday',
      defaultCalendarType: 'Gregorian',
    },
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
