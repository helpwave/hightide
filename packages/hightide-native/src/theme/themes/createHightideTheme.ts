import type { HightideDesignSystemTokens } from '@helpwave/hightide-design/design-system'

import { createAvatarTheme } from '../resolvers/avatar'
import { createButtonTheme } from '../resolvers/button'
import { createChatTheme } from '../resolvers/chat'
import { createCheckboxTheme } from '../resolvers/checkbox'
import { createChipTheme } from '../resolvers/chip'
import { createSwitchTheme } from '../resolvers/switch'
import { createIconButtonTheme } from '../resolvers/iconButton'
import { createInputTheme } from '../resolvers/input'
import { createCardTheme } from '../resolvers/card'
import { createMultiSelectTheme } from '../resolvers/multiSelect'
import { createSelectTheme } from '../resolvers/select'
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
      button: createButtonTheme(tokens),
      iconButton: createIconButtonTheme(tokens),
      chip: createChipTheme(tokens),
      checkbox: createCheckboxTheme(tokens),
      switch: createSwitchTheme(tokens),
      input: createInputTheme(tokens),
      select: createSelectTheme(tokens),
      multiSelect: createMultiSelectTheme(tokens),
      chat: createChatTheme(tokens),
      card: createCardTheme(tokens),
      avatar: createAvatarTheme(tokens),
      icon: tokens.components.icon,
    },
  }
}
