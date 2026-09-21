import type { SupportedThemesConfig } from '@helpwave/hightide-utils/context'

import type { SupportedLocalesConfig } from '../localization'
import { themes } from '../../theme/themes/hightideThemes'
import type { HightideTheme } from '../../theme/types/theme'

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
      theme: themes.light
    },
    dark: {
      nameTranslations: {
        'de-DE': 'Dunkel',
        'en-US': 'Dark',
      },
      theme: themes.dark,
    },
  } as const satisfies SupportedThemesConfig<HightideTheme>,
}
