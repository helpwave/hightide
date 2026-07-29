import type { ColorToken } from '../primitive/color'

export type ThemeRoleColorToken = {
  color: ColorToken,
  onColor: ColorToken,
  emphasis: ColorToken,
  tint: ColorToken,
  tintEmphasis: ColorToken,
}

export type ThemeRoleColorTokens = Record<
  'primary' | 'secondary' | 'positive' | 'warning' | 'negative' | 'neutral',
  ThemeRoleColorToken
>
