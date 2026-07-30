import { createHightideColorSchemes } from './colorScheme'
import type { HightideThemeTokens } from '../theme/themeTokens'
import type { HightideSemanticColorTokens } from './color'
import { toHightideElementLayoutFromTheme } from './elementLayout'
import { toHightideElevationShadow } from './shadow'
import type { HightideSemanticTokens } from './semanticTokens'
import { createHightideTypographyTokens } from './typography'

export type ToHightideSemanticArgs<Tokens extends HightideThemeTokens = HightideThemeTokens> = {
  themeTokens: Tokens,
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
  const {
    elementLayout,
    border,
    icon,
  } = toHightideElementLayoutFromTheme(themeTokens)

  return {
    colors: toSemanticColors(themeTokens.color),
    colorSchemes: createHightideColorSchemes(themeTokens.color),
    typography: createHightideTypographyTokens(themeTokens.typography),
    spacing: themeTokens.spacing,
    elementLayout,
    icon,
    radius: themeTokens.radius,
    border,
    shadow: toHightideElevationShadow(themeTokens.shadow),
  }
}
