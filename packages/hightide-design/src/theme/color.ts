import type { ColorToken } from '../primitive/color'

export type ThemeRoleColorToken = {
  color: ColorToken,
  onColor: ColorToken,
  emphasis: ColorToken,
  tint: ColorToken,
  tintEmphasis: ColorToken,
}

export type ThemeColorTokens = {
  transparent: ColorToken,
  background: ColorToken,
  onBackground: ColorToken,
  disabled: ColorToken,
  onDisabled: ColorToken,
  surface: ColorToken,
  onSurface: ColorToken,
  surfaceHover: ColorToken,
  surfaceVariant: ColorToken,
  subtle: ColorToken,
  faded: ColorToken,
  primary: ThemeRoleColorToken,
  secondary: ThemeRoleColorToken,
  positive: ThemeRoleColorToken,
  warning: ThemeRoleColorToken,
  negative: ThemeRoleColorToken,
  neutral: ThemeRoleColorToken,
}
