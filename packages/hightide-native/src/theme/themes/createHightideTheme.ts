import { componentTokenResolvers } from '@helpwave/hightide-design/component-token-resolvers'
import { hightideSemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import { createElementLayoutTokens } from '@helpwave/hightide-design/theme-tokens'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'

import { toAvatarThemeResolvers } from '../resolvers/avatar'
import { toButtonThemeResolvers } from '../resolvers/button'
import { toCardThemeResolvers } from '../resolvers/card'
import { toChatThemeResolvers } from '../resolvers/chat/chat-theme'
import { toCheckboxThemeResolvers } from '../resolvers/checkbox'
import { toChipThemeResolvers } from '../resolvers/chip'
import { createColorSchemes } from '../resolvers/colorScheme'
import { toIconThemeResolvers } from '../resolvers/icon'
import { toIconButtonThemeResolvers } from '../resolvers/iconButton'
import { toInputThemeResolvers } from '../resolvers/input'
import {
  toListItemThemeResolvers
} from '../resolvers/listItem'
import { toMultiSelectThemeResolvers } from '../resolvers/multiSelect'
import { toSelectThemeResolvers } from '../resolvers/select'
import { toSwitchThemeResolvers } from '../resolvers/switch'
import type { HightideThemeSemantics } from '../types/semantics'
import type { HightideTheme } from '../types/theme'

const bindSemantics = (themeTokens: ThemeTokens): HightideThemeSemantics => ({
  colorScheme: (parameter) => hightideSemanticTokenResolvers.colorScheme({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...parameter,
  }),
  coloringStyle: (parameter) => hightideSemanticTokenResolvers.coloringStyle({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...parameter,
  }),
  tintedSurface: (parameter) => hightideSemanticTokenResolvers.tintedSurface({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...parameter,
  }),
  withAppearance: (parameter) => hightideSemanticTokenResolvers.withAppearance({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...parameter,
  }),
  asFaded: (parameter) => hightideSemanticTokenResolvers.asFaded({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...parameter,
  }),
  asDescription: (parameter) => hightideSemanticTokenResolvers.asDescription({
    themeTokens,
    semanticResolvers: hightideSemanticTokenResolvers,
    ...parameter,
  }),
})

export const createHightideTheme = (themeTokens: ThemeTokens): HightideTheme => ({
  colors: themeTokens.color,
  colorSchemes: createColorSchemes(themeTokens),
  semantics: bindSemantics(themeTokens),
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
    button: toButtonThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
    iconButton: toIconButtonThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
    chip: toChipThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
    checkbox: toCheckboxThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
    switch: toSwitchThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
    input: toInputThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
    select: toSelectThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
    multiSelect: toMultiSelectThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
    chat: toChatThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
    card: toCardThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
    listItem: toListItemThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
    avatar: toAvatarThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
    icon: toIconThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
  },
})
