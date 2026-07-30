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
  placeholder: ColorToken,
  description: ColorToken,
  faded: ColorToken,
  menuBorder: ColorToken,
  progressTrack: ColorToken,
  switchThumbInactive: ColorToken,
  switchThumbActive: ColorToken,
  switchBorder: ColorToken,
  border: ColorToken,
  divider: ColorToken,
  primary: ThemeRoleColorToken,
  secondary: ThemeRoleColorToken,
  positive: ThemeRoleColorToken,
  warning: ThemeRoleColorToken,
  negative: ThemeRoleColorToken,
  neutral: ThemeRoleColorToken,
}
