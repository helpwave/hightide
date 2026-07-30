import { createColorSchemes } from './color-scheme'
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
  return {
    transparent: themeColors.transparent,
    background: themeColors.background,
    onBackground: themeColors.onBackground,
    disabled: themeColors.disabled,
    onDisabled: themeColors.onDisabled,
    surface: themeColors.surface,
    onSurface: themeColors.onSurface,
    surfaceHover: themeColors.surfaceHover,
    surfaceVariant: themeColors.surfaceVariant,
    placeholder: themeColors.subtle,
    description: themeColors.subtle,
    subtle: themeColors.subtle,
    border: themeColors.faded,
    divider: themeColors.faded,
  }
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
    colorSchemes: createColorSchemes(themeTokens.color),
    typography: createTypographyTokens(themeTokens.typography),
    spacing: themeTokens.spacing,
    elementLayout,
    icon,
    radius: themeTokens.radius,
    border,
    shadow: toHightideElevationShadow(themeTokens.shadow),
  }
}
