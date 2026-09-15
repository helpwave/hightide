import { TokenBuilder } from '../../utils'
import type { ThemeElevationLevel } from '../../theme-tokens/create'
import type { ResolvableShadowTokens } from '../resolvable-container-tokens'

export const elevationTokens = (level: ThemeElevationLevel) : ResolvableShadowTokens => ({
  color: TokenBuilder.colorValueRef(`theme.elevation.${level}.color`),
  spread: TokenBuilder.numberRef(`theme.elevation.${level}.spread`),
  blur: TokenBuilder.numberRef(`theme.elevation.${level}.blur`),
  x: TokenBuilder.numberRef(`theme.elevation.${level}.x`),
  y: TokenBuilder.numberRef(`theme.elevation.${level}.y`),
})
