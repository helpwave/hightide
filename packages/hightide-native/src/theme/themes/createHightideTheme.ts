import {
  createColorSchemeTokensFromThemeTokens,
  createElementLayoutTokens
} from '@helpwave/hightide-design/theme-tokens'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import { toAvatarTheme } from '../resolvers/avatar'
import { toButtonTheme } from '../resolvers/button'
import { toCardTheme } from '../resolvers/card'
import { toChatTheme } from '../resolvers/chat'
import { toCheckboxTheme } from '../resolvers/checkbox'
import { toChipTheme } from '../resolvers/chip'
import { toIconTheme } from '../resolvers/icon'
import { toIconButtonTheme } from '../resolvers/iconButton'
import { toInputTheme } from '../resolvers/input'
import { toMultiSelectTheme } from '../resolvers/multiSelect'
import { toSelectTheme } from '../resolvers/select'
import { toSwitchTheme } from '../resolvers/switch'
import type { HightideTheme } from '../types/theme'

export const createHightideTheme = (themeTokens: ThemeTokens): HightideTheme => ({
  colors: themeTokens.color,
  colorSchemes: createColorSchemeTokensFromThemeTokens(themeTokens),
  typography: themeTokens.typography,
  spacing: themeTokens.spacing,
  elements: createElementLayoutTokens(themeTokens),
  borderRadius: themeTokens.shape.borderRadius,
  border: themeTokens.borders.borderWidths,
  shadow: {
    raised: themeTokens.elevation.level1,
    container: themeTokens.elevation.level2,
    popover: themeTokens.elevation.level3,
    dialog: themeTokens.elevation.level4,
  },
  components: {
    button: toButtonTheme(themeTokens),
    iconButton: toIconButtonTheme(themeTokens),
    chip: toChipTheme(themeTokens),
    checkbox: toCheckboxTheme(themeTokens),
    switch: toSwitchTheme(themeTokens),
    input: toInputTheme(themeTokens),
    select: toSelectTheme(themeTokens),
    multiSelect: toMultiSelectTheme(themeTokens),
    chat: toChatTheme(themeTokens),
    card: toCardTheme(themeTokens),
    avatar: toAvatarTheme(themeTokens),
    icon: toIconTheme(themeTokens),
  },
})
