export type ColorToken = `#${string}`

export type SemanticColorTokens = Record<string, ColorToken>

const colorPaletteBasicSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
export type ColorPaletteBasicStep = typeof colorPaletteBasicSteps[number]

const colorPaletteDetailedSteps = [
  25, 50, 75, 100, 150, 200, 250,
  300, 350, 400, 450, 500,
  550, 600, 650, 700, 750,
  800, 850, 900, 925, 950, 975
]
export type ColorPaletteDetailedStep = typeof colorPaletteDetailedSteps[number]

export const ColorPaletteUtils = {
  basicSteps: colorPaletteBasicSteps,
  detailedSteps: colorPaletteDetailedSteps,
}

export type ColorPalette<Steps extends number> = Record<Steps, ColorToken>

export type ColorPaletteBasic = ColorPalette<ColorPaletteBasicStep>

export type ColorPaletteDetailed = ColorPalette<ColorPaletteDetailedStep>

export type ColorPaletteBasicToken = {
  type: 'basic',
  value: ColorPaletteBasic,
}

export type ColorPaletteDetailedToken = {
  type: 'detailed',
  value: ColorPaletteDetailed,
}

export type ColorPaletteSingleValueToken = {
  type: 'singleValue',
  value: ColorToken,
}

export type ColorPaletteToken =  ColorPaletteBasicToken | ColorPaletteDetailedToken | ColorPaletteSingleValueToken

export type ColorPaletteTokens = Record<string, ColorPaletteToken>
