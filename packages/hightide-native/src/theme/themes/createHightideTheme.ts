import type {
  ColorPaletteToken,
  HightideThemeTokens
} from '@helpwave/hightide-design/types'

import { createAvatarThemeFromDesign } from '../resolvers/avatar'
import { createButtonThemeFromDesign } from '../resolvers/button'
import { createChatThemeFromDesign } from '../resolvers/chat'
import { createCheckboxThemeFromDesign } from '../resolvers/checkbox'
import { createChipThemeFromDesign } from '../resolvers/chip'
import { createSwitchThemeFromDesign } from '../resolvers/switch'
import { createIconButtonThemeFromDesign } from '../resolvers/iconButton'
import { createInputThemeFromDesign } from '../resolvers/input'
import { createMenuThemeFromDesign } from '../resolvers/menu'
import { createMultiSelectThemeFromDesign } from '../resolvers/multiSelect'
import { createSelectThemeFromDesign } from '../resolvers/select'
import type {
  Color,
  ColorPalette,
  HightideColors
} from '../types/color'
import type { HightideTheme } from '../types/theme'

const unwrapColorPaletteToken = (token: ColorPaletteToken): Color | ColorPalette => {
  if (token.type === 'singleValue') {
    return token.value
  }
  return token.value
}

const unwrapColors = (colors: HightideThemeTokens['colors']): HightideColors & Record<string, Color | ColorPalette> => {
  const result: Record<string, Color | ColorPalette> = {}
  for (const [key, token] of Object.entries(colors)) {
    result[key] = unwrapColorPaletteToken(token)
  }
  return result as HightideColors & Record<string, Color | ColorPalette>
}

export const createHightideTheme = (tokens: HightideThemeTokens): HightideTheme => ({
  colors: unwrapColors(tokens.colors),
  semantic: tokens.semanticColors,
  typography: tokens.typography,
  layout: tokens.layout,
  decoration: tokens.decorcation,
  components: {
    coloring: tokens.coloring,
    button: createButtonThemeFromDesign(tokens),
    iconButton: createIconButtonThemeFromDesign(tokens),
    chip: createChipThemeFromDesign(tokens),
    checkbox: createCheckboxThemeFromDesign(tokens),
    switch: createSwitchThemeFromDesign(tokens),
    input: createInputThemeFromDesign(tokens),
    select: createSelectThemeFromDesign(tokens),
    multiSelect: createMultiSelectThemeFromDesign(tokens),
    chat: createChatThemeFromDesign(tokens),
    menu: createMenuThemeFromDesign(tokens),
    avatar: createAvatarThemeFromDesign(tokens),
  },
})
