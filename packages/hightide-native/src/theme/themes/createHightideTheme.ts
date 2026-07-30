import {
  hightidePrimitiveTokens,
  type ColorPalette,
  type HightidePrimitiveTokens
} from '@helpwave/hightide-design/primitive-tokens'
import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'

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
import type { ColorPalette as UnwrappedColorPalette } from '../types/color'
import type { HightideTheme } from '../types/theme'

const unwrapGrayPalette = (
  gray: ColorPalette
): UnwrappedColorPalette => {
  if (gray.type === 'singleValue') {
    throw new Error('Expected gray palette scale, got singleValue')
  }
  return gray.value
}

export const createHightideTheme = (
  tokens: HightideDesignSystemTokens,
  primitives: HightidePrimitiveTokens = hightidePrimitiveTokens
): HightideTheme => {
  const gray = unwrapGrayPalette(primitives.color.palettes.gray)

  return {
    colors: tokens.semantic.colors,
    colorSchemes: tokens.semantic.colorSchemes,
    typography: tokens.semantic.typography,
    spacing: tokens.semantic.spacing,
    elements: tokens.semantic.elementLayout,
    radius: tokens.semantic.radius,
    border: tokens.semantic.border,
    shadow: tokens.semantic.shadow,
    components: {
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
      avatar: createAvatarThemeFromDesign(tokens, { gray }),
      icon: tokens.components.icon,
    },
  }
}
