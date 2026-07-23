import type {
  ColorPaletteToken,
  HightideDesignTokens
} from '@helpwave/hightide-design/types'

import { createButtonThemeFromDesign } from '../resolvers/button'
import { createChatThemeFromDesign } from '../resolvers/chat'
import { createCheckboxThemeFromDesign } from '../resolvers/checkbox'
import { createChipThemeFromDesign } from '../resolvers/chip'
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
import type { Theme } from '../types/theme'

const unwrapColorPaletteToken = (token: ColorPaletteToken): Color | ColorPalette => {
  if (token.type === 'singleValue') {
    return token.value
  }
  return token.value
}

const unwrapColors = (colors: HightideDesignTokens['colors']): HightideColors & Record<string, Color | ColorPalette> => {
  const result: Record<string, Color | ColorPalette> = {}
  for (const [key, token] of Object.entries(colors)) {
    result[key] = unwrapColorPaletteToken(token)
  }
  return result as HightideColors & Record<string, Color | ColorPalette>
}

export const createTheme = (tokens: HightideDesignTokens): Theme => ({
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
    input: createInputThemeFromDesign(tokens),
    select: createSelectThemeFromDesign(tokens),
    multiSelect: createMultiSelectThemeFromDesign(tokens),
    chat: createChatThemeFromDesign(tokens),
    menu: createMenuThemeFromDesign(tokens),
  },
})
