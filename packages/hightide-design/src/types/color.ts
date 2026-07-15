export type ColorPaletteBasicStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

export type ColorPaletteDetailedStep =
  | 25
  | 50
  | 75
  | 100
  | 150
  | 200
  | 250
  | 300
  | 350
  | 400
  | 450
  | 500
  | 550
  | 600
  | 650
  | 700
  | 750
  | 800
  | 850
  | 900
  | 925
  | 950
  | 975

export type ColorValue = `#${string}` | `rgb(${string})` | `rgba(${string})`

export type ColorPaletteBasic = Record<ColorPaletteBasicStep, ColorValue>

export type ColorPaletteDetailed = Record<ColorPaletteDetailedStep, ColorValue>

export type DesignColorPalettes = {
  white: ColorValue,
  black: ColorValue,
  gray: ColorPaletteDetailed,
  green: ColorPaletteBasic,
  orange: ColorPaletteBasic,
  purple: ColorPaletteBasic,
  blue: ColorPaletteBasic,
  red: ColorPaletteBasic,
}
