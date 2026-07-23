import type { SupportedThemesConfig } from '@helpwave/hightide-utils/context'

import type { SupportedLocalesConfig } from '../localization/forward-exports'
import { themes } from '../../theme/themes/hightideThemes'
import type { HightideTheme } from '../../theme/types/theme'

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
