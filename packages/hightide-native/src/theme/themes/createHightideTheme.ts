import { componentTokenResolvers } from '@helpwave/hightide-design/component-token-resolvers'
import {
  hightideSemanticTokenResolvers,
  resolveContainerLayout,
  resolveControlLayout,
  resolveInsideControlLayout,
  type ElementLayoutTokens
} from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ThemeLayoutSize, ThemeTokens, ThemeTypographySize } from '@helpwave/hightide-design/theme-tokens'

import {
  toAvatarGroupThemeResolvers,
  toAvatarThemeResolvers,
  toAvatarWithStatusThemeResolvers
} from '../resolvers/avatar'
import { toButtonThemeResolvers } from '../resolvers/button'
import { toCardThemeResolvers } from '../resolvers/card'
import { toChatThemeResolvers } from '../resolvers/chat/chat-theme'
import { toCheckboxThemeResolvers } from '../resolvers/checkbox'
import { toChipThemeResolvers } from '../resolvers/chip'
import { toDividerThemeResolvers } from '../resolvers/divider'
import { toIconThemeResolvers } from '../resolvers/icon'
import { toIconButtonThemeResolvers } from '../resolvers/iconButton'
import { toInputThemeResolvers } from '../resolvers/input'
import { toSearchBarThemeResolvers } from '../resolvers/searchBar'
import {
  toListItemThemeResolvers
} from '../resolvers/listItem'
import { toMultiSelectThemeResolvers } from '../resolvers/multiSelect'
import { toSelectThemeResolvers } from '../resolvers/select'
import { toSwitchThemeResolvers } from '../resolvers/switch'
import { toTextareaThemeResolvers } from '../resolvers/textarea'
import { toThemedPressableThemeResolvers } from '../resolvers/themedPressable'
import type { HightideThemeSemantics } from '../types/semantics'
import type { HightideTheme } from '../types/theme'

const layoutSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies readonly ThemeLayoutSize[]
const typographySizes = ['sm', 'md', 'lg'] as const satisfies readonly ThemeTypographySize[]

const resolveElementLayouts = (themeTokens: ThemeTokens): ElementLayoutTokens => ({
  control: Object.fromEntries(
    layoutSizes.map((size) => [
      size,
      resolveControlLayout({ themeTokens, size }),
    ])
  ) as ElementLayoutTokens['control'],
  container: Object.fromEntries(
    layoutSizes.map((size) => [
      size,
      resolveContainerLayout({ themeTokens, size }),
    ])
  ) as ElementLayoutTokens['container'],
  insideControl: Object.fromEntries(
    typographySizes.map((size) => [
      size,
      resolveInsideControlLayout({ themeTokens, size }),
    ])
  ) as ElementLayoutTokens['insideControl'],
})

const bindSemantics = (themeTokens: ThemeTokens): HightideThemeSemantics => ({
  ...resolveElementLayouts(themeTokens),
  coloringColorVariant: (parameter) => hightideSemanticTokenResolvers.coloringColorVariant({
    themeTokens,
    ...parameter,
  }),
  coloringStyle: (parameter) => hightideSemanticTokenResolvers.coloringStyle({
    themeTokens,
    ...parameter,
  }),
  pressableColoring: (parameter) => hightideSemanticTokenResolvers.pressableColoring({
    themeTokens,
    ...parameter,
  }),
  pressableStateLayerTint: (parameter) => hightideSemanticTokenResolvers.pressableStateLayerTint({
    themeTokens,
    ...parameter,
  }),
  inputColoring: (parameter) => hightideSemanticTokenResolvers.inputColoring({
    themeTokens,
    ...parameter,
  }),
  controlLayout: (parameter) => hightideSemanticTokenResolvers.controlLayout({
    themeTokens,
    ...parameter,
  }),
  touchTargetSize: (parameter) => hightideSemanticTokenResolvers.touchTargetSize({
    themeTokens,
    ...parameter,
  }),
  containerLayout: (parameter) => hightideSemanticTokenResolvers.containerLayout({
    themeTokens,
    ...parameter,
  }),
  insideControlLayout: (parameter) => hightideSemanticTokenResolvers.insideControlLayout({
    themeTokens,
    ...parameter,
  }),
  tintedSurface: (parameter) => hightideSemanticTokenResolvers.tintedSurface({
    themeTokens,
    ...parameter,
  }),
  withAppearance: (parameter) => hightideSemanticTokenResolvers.withAppearance({
    themeTokens,
    ...parameter,
  }),
  asFaded: (parameter) => hightideSemanticTokenResolvers.asFaded({
    themeTokens,
    ...parameter,
  }),
  asDescription: (parameter) => hightideSemanticTokenResolvers.asDescription({
    themeTokens,
    ...parameter,
  }),
})

export const createHightideTheme = (themeTokens: ThemeTokens): HightideTheme => ({
  colors: themeTokens.color,
  fontFamilies: themeTokens.fontFamilies,
  fontWeights: themeTokens.fontWeights,
  fontSizing: themeTokens.fontSizing,
  typography: themeTokens.typography,
  icongraphy: themeTokens.icongraphy,
  size: themeTokens.size,
  spacing: themeTokens.spacing,
  padding: themeTokens.padding,
  borderRadius: themeTokens.borderRadius,
  borderWidth: themeTokens.borderWidth,
  elevation: themeTokens.elevation,
  shadow: {
    raised: themeTokens.elevation.level1,
    container: themeTokens.elevation.level2,
    popover: themeTokens.elevation.level3,
    dialog: themeTokens.elevation.level4,
  },
  motion: themeTokens.motion,
  focusOutline: themeTokens.focusOutline,
  config: themeTokens.config,
  semantics: bindSemantics(themeTokens),
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
    themedPressable: toThemedPressableThemeResolvers({
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
    textarea: toTextareaThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
    searchBar: toSearchBarThemeResolvers({
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
    divider: toDividerThemeResolvers({
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
    avatarWithStatus: toAvatarWithStatusThemeResolvers({
      themeTokens,
      semanticTokens: hightideSemanticTokenResolvers,
      componentTokens: componentTokenResolvers,
    }),
    avatarGroup: toAvatarGroupThemeResolvers({
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
