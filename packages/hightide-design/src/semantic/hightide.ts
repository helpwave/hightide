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
  faded: ColorToken,
  menuBorder: ColorToken,
  progressTrack: ColorToken,
  switchThumbInactive: ColorToken,
  switchThumbActive: ColorToken,
  switchBorder: ColorToken,
  border: ColorToken,
  divider: ColorToken,
}

export const hightideSemanticColorKeys = [
  'transparent',
  'background',
  'onBackground',
  'disabled',
  'onDisabled',
  'surface',
  'onSurface',
  'surfaceHover',
  'surfaceVariant',
  'placeholder',
  'description',
  'faded',
  'menuBorder',
  'progressTrack',
  'switchThumbInactive',
  'switchThumbActive',
  'switchBorder',
  'border',
  'divider',
] as const satisfies readonly (keyof HightideSemanticColorTokens)[]
