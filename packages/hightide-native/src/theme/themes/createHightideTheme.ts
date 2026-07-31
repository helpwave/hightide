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
import type { HightideTheme } from '../types/theme'

export const createHightideTheme = (
  tokens: HightideDesignSystemTokens
): HightideTheme => {
  return {
    colors: tokens.colors,
    colorSchemes: tokens.colorSchemes,
    typography: tokens.typography,
    spacing: tokens.spacing,
    elements: tokens.elementLayout,
    borderRadius: tokens.borderRadius,
    border: tokens.borderWidth,
    shadow: tokens.shadow,
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
      avatar: createAvatarThemeFromDesign(tokens),
      icon: tokens.components.icon,
    },
  }
}
