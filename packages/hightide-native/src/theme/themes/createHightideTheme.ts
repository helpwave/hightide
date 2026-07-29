import {
  hightidePrimitiveTokens,
  type ColorPalette,
  type PrimitiveTokens
} from '@helpwave/hightide-design/primitive'
import type { DesignSystemTokens } from '@helpwave/hightide-design/design-system'

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

const unwrapColors = (
  palettes: PrimitiveTokens['color']['palettes']
): HightideColors & Record<string, Color | UnwrappedColorPalette> => {
  const result: Record<string, Color | UnwrappedColorPalette> = {}
  for (const [key, token] of Object.entries(palettes)) {
    result[key] = unwrapColorPaletteToken(token)
  }
  return result as HightideColors & Record<string, Color | UnwrappedColorPalette>
}

export const createHightideTheme = (
  tokens: DesignSystemTokens,
  primitives: PrimitiveTokens = hightidePrimitiveTokens
): HightideTheme => {
  const colors = unwrapColors(primitives.color.palettes)

  return {
    colors,
    semantic: tokens.semantic.colors,
    typography: tokens.semantic.typography,
    spacing: tokens.semantic.spacing,
    elements: tokens.semantic.elements,
    breakpoint: tokens.semantic.breakpoint,
    radius: tokens.semantic.radius,
    border: tokens.semantic.border,
    shadow: tokens.semantic.shadow,
    motion: tokens.semantic.motion,
    components: {
      coloring: tokens.semantic.coloring,
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
      avatar: createAvatarThemeFromDesign(tokens, { gray: colors.gray }),
    },
  }
}
