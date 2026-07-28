import type { ColorPalette } from '@helpwave/hightide-design/primitive'
import type { HightideThemeTokens } from '@helpwave/hightide-design/theme'

import { createAvatarThemeFromDesign } from '../resolvers/avatar'
import { createButtonThemeFromDesign } from '../resolvers/button'
import { createChatThemeFromDesign } from '../resolvers/chat'
import { createCheckboxThemeFromDesign } from '../resolvers/checkbox'
import { createChipThemeFromDesign } from '../resolvers/chip'
import { createSwitchThemeFromDesign } from '../resolvers/switch'
import { createIconButtonThemeFromDesign } from '../resolvers/iconButton'
import { createInputThemeFromDesign } from '../resolvers/input'
import { createCardThemeFromDesign } from '../resolvers/card'
import { createMultiSelectThemeFromDesign } from '../resolvers/multiSelect'
import { createSelectThemeFromDesign } from '../resolvers/select'
import type {
  Color,
  ColorPalette as UnwrappedColorPalette,
  HightideColors
} from '../types/color'
import type { HightideTheme } from '../types/theme'

const unwrapColorPaletteToken = (token: ColorPalette): Color | UnwrappedColorPalette => {
  if (token.type === 'singleValue') {
    return token.value
  }
  return token.value
}

const unwrapColors = (colors: HightideThemeTokens['colors']): HightideColors & Record<string, Color | UnwrappedColorPalette> => {
  const result: Record<string, Color | UnwrappedColorPalette> = {}
  for (const [key, token] of Object.entries(colors)) {
    result[key] = unwrapColorPaletteToken(token)
  }
  return result as HightideColors & Record<string, Color | UnwrappedColorPalette>
}

export const createHightideTheme = (tokens: HightideThemeTokens): HightideTheme => ({
  colors: unwrapColors(tokens.colors),
  semantic: tokens.semanticColors,
  typography: tokens.typography,
  spacing: tokens.spacing,
  elements: tokens.elements,
  breakpoint: tokens.breakpoint,
  radius: tokens.radius,
  border: tokens.border,
  shadow: tokens.shadow,
  motion: tokens.motion,
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
    card: createCardThemeFromDesign(tokens),
    avatar: createAvatarThemeFromDesign(tokens),
  },
})
