import type { ColorToken } from '../primitive/color'

export type HightideThemeRoleColorToken = {
  color: ColorToken,
  onColor: ColorToken,
  emphasis: ColorToken,
  tint: ColorToken,
  tintEmphasis: ColorToken,
}

export type HightideThemeColorTokens = {
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
  primary: HightideThemeRoleColorToken,
  secondary: HightideThemeRoleColorToken,
  positive: HightideThemeRoleColorToken,
  warning: HightideThemeRoleColorToken,
  negative: HightideThemeRoleColorToken,
  neutral: HightideThemeRoleColorToken,
}
