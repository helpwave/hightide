import type {
  ColorPaletteBasic,
  ColorPaletteBasicStep,
  ColorPaletteDetailed,
  ColorPaletteDetailedStep,
  HexColor,
  ThemeColorTokens,
  ThemeMode
} from './types'

const BASIC_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const satisfies ReadonlyArray<ColorPaletteBasicStep>

const DETAILED_STEPS = [
  25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 925, 950, 975,
] as const satisfies ReadonlyArray<ColorPaletteDetailedStep>

const parseHex = (color: HexColor): [number, number, number] => {
  const value = color.slice(1)
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ]
}

const formatHex = (red: number, green: number, blue: number): HexColor => {
  const channel = (value: number) => Math.round(value).toString(16).padStart(2, '0')
  return `#${channel(red)}${channel(green)}${channel(blue)}`
}

const interpolateHex = (from: HexColor, to: HexColor, ratio: number): HexColor => {
  const [fromRed, fromGreen, fromBlue] = parseHex(from)
  const [toRed, toGreen, toBlue] = parseHex(to)
  return formatHex(
    fromRed + (toRed - fromRed) * ratio,
    fromGreen + (toGreen - fromGreen) * ratio,
    fromBlue + (toBlue - fromBlue) * ratio
  )
}

const fillPalette = <TStep extends number>(
  steps: readonly TStep[],
  anchors: Partial<Record<TStep, HexColor>>,
  bounds: { lower: { step: number, color: HexColor }, upper: { step: number, color: HexColor } }
): Record<TStep, HexColor> => {
  const defined = steps
    .filter((step) => anchors[step] !== undefined)
    .map((step) => ({ step, color: anchors[step]! }))

  return Object.fromEntries(
    steps.map((step) => {
      if (anchors[step] !== undefined) {
        return [step, anchors[step]!]
      }

      let lower = bounds.lower
      let upper = bounds.upper

      for (const anchor of defined) {
        if (anchor.step < step && anchor.step >= lower.step) {
          lower = anchor
        }
        if (anchor.step > step && anchor.step <= upper.step) {
          upper = anchor
        }
      }

      const ratio = (step - lower.step) / (upper.step - lower.step)
      return [step, interpolateHex(lower.color, upper.color, ratio)]
    })
  ) as Record<TStep, HexColor>
}

const fillBasicPalette = (
  anchors: Partial<Record<ColorPaletteBasicStep, HexColor>>
): ColorPaletteBasic => fillPalette(BASIC_STEPS, anchors, {
  lower: { step: 0, color: '#ffffff' },
  upper: { step: 1000, color: '#000000' }
})

const fillDetailedPalette = (
  anchors: Partial<Record<ColorPaletteDetailedStep, HexColor>>
): ColorPaletteDetailed => fillPalette(DETAILED_STEPS, anchors, {
  lower: { step: 0, color: '#ffffff' },
  upper: { step: 1000, color: '#000000' }
})

export type BasicColorPalette = {
  white: HexColor,
  black: HexColor,
  gray: ColorPaletteDetailed,
  green: ColorPaletteBasic,
  orange: ColorPaletteBasic,
  purple: ColorPaletteBasic,
  blue: ColorPaletteBasic,
  red: ColorPaletteBasic,
}

const grayAnchors = {
  25: '#f8f8f8',
  50: '#f2f2f2',
  75: '#eeeeee',
  100: '#e6e6e6',
  150: '#d8d8d8',
  200: '#cccccc',
  250: '#c0c0c0',
  300: '#b3b3b3',
  400: '#999999',
  500: '#888888',
  550: '#777777',
  600: '#666666',
  650: '#555555',
  700: '#4d4d4d',
  750: '#3f3f3f',
  800: '#333333',
  850: '#222222',
  900: '#1a1a1a',
  950: '#0d0d0d',
} as const satisfies Partial<Record<ColorPaletteDetailedStep, HexColor>>

export const basicColorPalette = {
  white: '#ffffff',
  black: '#000000',
  gray: fillDetailedPalette(grayAnchors),
  green: fillBasicPalette({
    100: '#d1efd8',
    500: '#69cb81',
    600: '#61bf78',
    700: '#53a567',
    900: '#2c5536',
  }),
  orange: fillBasicPalette({
    100: '#fbecd9',
    200: '#f7d8b3',
    500: '#ea9e40',
    600: '#c18133',
    900: '#4a2f1a',
  }),
  purple: fillBasicPalette({
    50: '#efe6fd',
    100: '#ceb0fa',
    200: '#b892f3',
    300: '#9b7cdd',
    400: '#8470c5',
    500: '#694bb4',
    600: '#56389b',
    700: '#462c83',
    800: '#362165',
    900: '#27144a',
    950: '#1b0d33',
  }),
  blue: fillBasicPalette({
    50: '#f6faff',
    100: '#d6e3f9',
    200: '#99b9ef',
    500: '#3272df',
    600: '#285bb2',
    800: '#1a4080',
    900: '#11243e',
  }),
  red: fillBasicPalette({
    50: '#fff9f9',
    100: '#fbe0e2',
    200: '#f7c2c5',
    300: '#f4a3a7',
    400: '#e3798a',
    500: '#dc576d',
    600: '#d53550',
    700: '#bb273f',
    900: '#5c252e',
  }),
} as const satisfies BasicColorPalette

export type BasicColorTokenMap = {
  white: HexColor,
  black: HexColor,
} & {
  [K in ColorPaletteDetailedStep as `gray${K}`]: HexColor
} & {
  [K in ColorPaletteBasicStep as `green${K}`]: HexColor
} & {
  [K in ColorPaletteBasicStep as `orange${K}`]: HexColor
} & {
  [K in ColorPaletteBasicStep as `purple${K}`]: HexColor
} & {
  [K in ColorPaletteBasicStep as `blue${K}`]: HexColor
} & {
  [K in ColorPaletteBasicStep as `red${K}`]: HexColor
}

const flattenBasicColors = (): BasicColorTokenMap => {
  const result = {
    white: basicColorPalette.white,
    black: basicColorPalette.black,
  } as unknown as BasicColorTokenMap

  for (const step of DETAILED_STEPS) {
    result[`gray${step}`] = basicColorPalette.gray[step]
  }

  for (const step of BASIC_STEPS) {
    result[`green${step}`] = basicColorPalette.green[step]
    result[`orange${step}`] = basicColorPalette.orange[step]
    result[`purple${step}`] = basicColorPalette.purple[step]
    result[`blue${step}`] = basicColorPalette.blue[step]
    result[`red${step}`] = basicColorPalette.red[step]
  }

  return result
}

const flattenedBasicColors = flattenBasicColors()

export const basicColors: ThemeColorTokens<BasicColorTokenMap> = {
  light: flattenedBasicColors,
  dark: flattenedBasicColors,
}

export const getBasicColors = (mode: ThemeMode): BasicColorTokenMap => basicColors[mode]
