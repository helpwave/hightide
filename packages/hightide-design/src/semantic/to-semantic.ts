import type { ThemeTokens } from '../theme/theme-tokens'
import type { SemanticColorTokens } from './color'
import { toHightideElementLayoutFromTheme } from './element-layout'
import { toHightideElevationShadow } from './shadow'
import type { SemanticTokens } from './semantic-tokens'
import { createTypographyTokens } from './typography'

export type ToSemanticArgs<Tokens extends ThemeTokens = ThemeTokens> = {
  themeTokens: Tokens,
}

const toSemanticColors = (themeColors: ThemeTokens['color']): SemanticColorTokens => {
  return { ...themeColors }
}

export const toHightideSemanticTokens = ({
  themeTokens,
}: ToSemanticArgs): SemanticTokens => {
  const {
    elementLayout,
    border,
    icon,
  } = toHightideElementLayoutFromTheme(themeTokens)

  return {
    colors: toSemanticColors(themeTokens.color),
    colorSchemes: themeTokens.colorSchemes,
    typography: createTypographyTokens(themeTokens.typography),
    spacing: themeTokens.spacing,
    elementLayout,
    icon,
    radius: themeTokens.radius,
    border,
    shadow: toHightideElevationShadow(themeTokens.shadow),
    motion: themeTokens.motion,
  }
}
