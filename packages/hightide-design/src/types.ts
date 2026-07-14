export type ThemeMode = 'light' | 'dark'

export type HexColor = `#${string}`

export type RemValue = `${number}rem`

export type TimeValue = `${number}ms`

export type ElementSize = 'xs' | 'sm' | 'md' | 'lg'

export type ThemeColorTokens<T extends Record<string, HexColor>> = Record<ThemeMode, T>

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

export type ColorPaletteBasic = Record<ColorPaletteBasicStep, HexColor>

export type ColorPaletteDetailed = Record<ColorPaletteDetailedStep, HexColor>
