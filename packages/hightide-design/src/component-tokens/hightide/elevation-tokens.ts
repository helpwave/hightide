import { TokenBuilder } from '../../utils'
import type { ThemeElevationLevel } from '../../theme-tokens/create'
import type { ShadowTokens } from '../container-tokens'

export const elevationTokens = (level: ThemeElevationLevel) : ShadowTokens => ({
  color: TokenBuilder.colorValueRef(`theme.elevation.${level}.color`),
  spread: TokenBuilder.numberRef(`theme.elevation.${level}.spread`),
  blur: TokenBuilder.numberRef(`theme.elevation.${level}.blur`),
  x: TokenBuilder.numberRef(`theme.elevation.${level}.x`),
  y: TokenBuilder.numberRef(`theme.elevation.${level}.y`),
})
