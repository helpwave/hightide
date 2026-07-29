import type { ColoringType } from '../theme/coloring'
import type { ColoringStyle } from '../theme/coloring'
import type { ColorSchemes } from '../theme/coloring'

export type {
  ButtonColoringStyle,
  ChipColoringStyle,
  ColorScheme,
  ColorSchemes,
  ColoringStyle,
  ColoringStyleBase,
  ColoringType
} from '../theme/coloring'
export { coloringTypes, createColorSchemes } from '../theme/coloring'
export type { ColorState } from '../theme/color-state'
export type {
  ElementState,
  StateBasedProperty
} from '../theme/state-based-property'
export { resolveStateBasedProperty } from '../theme/state-based-property'

export const getColoringToken = (
  style: ColoringStyle,
  color: ColoringType,
  definitions: ColorSchemes
) => definitions[color][style]
