import type { ColoringType } from '../theme/coloring'
import type { ColoringTokens } from '../theme/coloring'

export type {
  ButtonColoringStyle,
  ChipColoringStyle,
  ColoringStyle,
  ColoringStyleBase,
  ColoringTokens,
  ColoringType,
  RoleColoringTokens
} from '../theme/coloring'
export { coloringTypes, createColoringTokens } from '../theme/coloring'
export type { ColorState } from '../theme/color-state'
export type {
  ElementState,
  StateBasedProperty
} from '../theme/state-based-property'
export { resolveStateBasedProperty } from '../theme/state-based-property'

export const getColoringToken = <Style extends keyof ColoringTokens>(
  style: Style,
  color: ColoringType,
  definitions: ColoringTokens
) => definitions[style][color]
