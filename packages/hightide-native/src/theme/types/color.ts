export type Color = `#${string}`

export type ColorPalette = Record<number, Color>

export type HightideColors = {
  white: Color,
  black: Color,
  transparent: Color,
  gray: ColorPalette,
  green: ColorPalette,
  orange: ColorPalette,
  purple: ColorPalette,
  blue: ColorPalette,
  red: ColorPalette,
}

export type HightideSemanticColors = {
  transparent: Color,
  background: Color,
  onBackground: Color,
  disabled: Color,
  onDisabled: Color,
  surface: Color,
  onSurface: Color,
  surfaceHover: Color,
  surfaceVariant: Color,
  placeholder: Color,
  description: Color,
  faded: Color,
  menuBorder: Color,
  progressTrack: Color,
  switchThumbInactive: Color,
  switchThumbActive: Color,
  switchBorder: Color,
  border: Color,
  divider: Color,
}
