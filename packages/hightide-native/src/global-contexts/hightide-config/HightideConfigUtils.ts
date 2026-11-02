import {
  HightideSupportedLocaleInformation,
  HightideSupportedThemeInformation,
  type SupportedThemesConfig
} from '@helpwave/hightide-utils/context'

import { themes } from '../../theme/themes/hightideThemes'
import type { HightideTheme } from '../../theme/types/theme'

export const HightideConfigUtils = {
  defaultSupportedLocales: HightideSupportedLocaleInformation,
  defaultSupportedThemes: {
    light: {
      ...HightideSupportedThemeInformation.light,
      theme: themes.light,
    },
    dark: {
      ...HightideSupportedThemeInformation.dark,
      theme: themes.dark,
    },
  } as const satisfies SupportedThemesConfig<HightideTheme>,
}
