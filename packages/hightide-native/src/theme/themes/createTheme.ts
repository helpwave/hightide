import type { DesignTokens as DesignTokensTheme } from '@helpwave/hightide-design/types'
import {
  createButtonThemeFromDesign,
  createChatThemeFromDesign,
  createCheckboxThemeFromDesign,
  createChipThemeFromDesign,
  createIconButtonThemeFromDesign,
  createInputThemeFromDesign,
  createMenuThemeFromDesign,
  createMultiSelectThemeFromDesign,
  createSelectThemeFromDesign
} from '../resolvers'
import type { DesignTheme } from '../types'

export const createDesignTheme = (tokens: DesignTokensTheme): DesignTheme => ({
  palettes: tokens.palettes,
  semantic: tokens.semantic,
  coloring: tokens.coloring,
  typography: tokens.typography,
  components: {
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
