import type { ColorToken } from '../primitive-tokens/color'
import type { HightideThemeTokens } from '../theme-tokens'

export type HightideSemanticColorTokens = {
  transparent: ColorToken,
  background: ColorToken,
  onBackground: ColorToken,
  disabled: ColorToken,
  onDisabled: ColorToken,
  surface: ColorToken,
  onSurface: ColorToken,
  surfaceHover: ColorToken,
  surfaceVariant: ColorToken,
  placeholder: ColorToken,
  description: ColorToken,
  subtle: ColorToken,
  border: ColorToken,
  divider: ColorToken,
}

export const toSemanticColorTokens = (themeTokens: HightideThemeTokens): HightideSemanticColorTokens => {
  const { colors } = themeTokens
  return {
    transparent: colors.transparent,
    background: colors.background,
    onBackground: colors.onBackground,
    disabled: colors.disabled,
    onDisabled: colors.onDisabled,
    surface: colors.surface,
    onSurface: colors.onSurface,
    surfaceHover: colors.surfaceHover,
    surfaceVariant: colors.surfaceVariant,
    placeholder: colors.subtle,
    description: colors.subtle,
    subtle: colors.subtle,
    border: colors.faded,
    divider: colors.faded,
  }
}