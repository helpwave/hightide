import type { DesignTheme as DesignTokensTheme } from '@helpwave/hightide-design'
import {
  createButtonThemeFromDesign,
  createCheckboxThemeFromDesign,
  createChipThemeFromDesign,
  createIconButtonThemeFromDesign,
  createInputThemeFromDesign,
  createMultiSelectThemeFromDesign,
  createSelectThemeFromDesign
} from '../resolvers'
import type { DesignTheme } from '../types'

export const createDesignTheme = (tokens: DesignTokensTheme): DesignTheme => ({
  palettes: tokens.palettes,
  semantic: tokens.semantic,
  coloring: tokens.coloring,
  components: {
    button: createButtonThemeFromDesign(tokens),
    iconButton: createIconButtonThemeFromDesign(tokens),
    chip: createChipThemeFromDesign(tokens),
    checkbox: createCheckboxThemeFromDesign(tokens),
    input: createInputThemeFromDesign(tokens),
    select: createSelectThemeFromDesign(tokens),
    multiSelect: createMultiSelectThemeFromDesign(tokens),
  },
})
