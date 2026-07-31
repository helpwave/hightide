import { createHightideColorSchemes } from './colorScheme'
import type { HightideThemeTokens } from '../theme-tokens/themeTokens'
import type { HightideSemanticColorTokens } from './color'
import { toHightideElementLayoutFromTheme } from './elementLayout'
import { toHightideElevationShadow } from './shadow'
import type { HightideSemanticTokens } from './semanticTokens'
import { createHightideTypographyTokens } from './typography'

export type ToHightideSemanticArgs = {
  themeTokens: HightideThemeTokens,
}

const toSemanticColors = (themeColors: HightideThemeTokens['color']): HightideSemanticColorTokens => {
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
}: ToHightideSemanticArgs): HightideSemanticTokens => {
  return {
    colors: toSemanticColors(themeTokens.color),
    colorSchemes: createHightideColorSchemes(themeTokens.color),
    typography: createHightideTypographyTokens(themeTokens.typography),
    spacing: themeTokens.spacing,
    elementLayout: toHightideElementLayoutFromTheme(themeTokens),
    radius: themeTokens.radius,
    border: themeTokens.border,
    shadow: toHightideElevationShadow(themeTokens.shadow),
  }
}
