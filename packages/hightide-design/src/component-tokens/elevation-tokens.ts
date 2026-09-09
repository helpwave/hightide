import type { ThemeElevationLevel } from '../theme-tokens/theme-tokens-config'
import { tokenVariable } from './builders'

export const elevationTokens = (level: ThemeElevationLevel) => ({
  color: tokenVariable(`theme.elevation.${level}.color`),
  spread: tokenVariable(`theme.elevation.${level}.spread`),
  blur: tokenVariable(`theme.elevation.${level}.blur`),
  x: tokenVariable(`theme.elevation.${level}.x`),
  y: tokenVariable(`theme.elevation.${level}.y`),
})
