import type { ColoringType } from '../theme/coloring'
import type { ColoringTokens } from '../theme/coloring'

export { coloringTypes } from '../theme/coloring'
export type { ColoringType } from '../theme/coloring'

export const getColoringToken = <Style extends keyof ColoringTokens>(
  style: Style,
  color: ColoringType,
  definitions: ColoringTokens
) => definitions[style][color]
