import { createColorSchemes } from '../theme/color-scheme'
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
    placeholder: themeColors.placeholder,
    description: themeColors.description,
    faded: themeColors.faded,
    menuBorder: themeColors.menuBorder,
    progressTrack: themeColors.progressTrack,
    switchThumbInactive: themeColors.switchThumbInactive,
    switchThumbActive: themeColors.switchThumbActive,
    switchBorder: themeColors.switchBorder,
    border: themeColors.border,
    divider: themeColors.divider,
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
    motion: themeTokens.motion,
  }
}
