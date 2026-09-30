import { PropsUtil } from './propsUtil'

export const coloringModes = ['static', 'interactive'] as const

export type ColoringMode = typeof coloringModes[number]

export const coloringStyles = ['filled', 'foreground'] as const

export type ColoringStyle = typeof coloringStyles[number]

export const coloringColorVariants = ['normal', 'tonal', 'transparent'] as const

export type ColoringColorVariant = typeof coloringColorVariants[number]

export const coloringColors = [
  'primary',
  'secondary',
  'positive',
  'warning',
  'negative',
  'neutral',
  'description',
  'surface',
  'surface-inverse',
  'surface-variant',
  'surface-warning',
  'disabled',
] as const

export type ColoringColor = typeof coloringColors[number]

export type ColoringBuildParams = {
  color: ColoringColor,
  mode?: ColoringMode,
  colorVariant?: ColoringColorVariant,
  coloringStyle?: ColoringStyle,
  bordered?: boolean,
  elevated?: boolean,
}

export type ColoringDataAttributes = {
  'data-color': ColoringColor,
  'data-coloring-mode': ColoringMode,
  'data-color-variant': ColoringColorVariant,
  'data-coloring-style': ColoringStyle,
  'data-bordered': '' | undefined,
  'data-elevated': '' | undefined,
}

const dataColor = (value: ColoringColor | undefined) => ({
  'data-color': value,
})

const dataColoringMode = (value: ColoringMode | undefined) => ({
  'data-coloring-mode': value,
})

const dataColorVariant = (value: ColoringColorVariant | undefined) => ({
  'data-color-variant': value,
})

const dataColoringStyle = (value: ColoringStyle | undefined) => ({
  'data-coloring-style': value,
})

const dataBordered = (value: boolean | undefined) => ({
  'data-bordered': PropsUtil.dataAttributes.bool(!!value) as '' | undefined,
})

const dataElevated = (value: boolean | undefined) => ({
  'data-elevated': PropsUtil.dataAttributes.bool(!!value) as '' | undefined,
})

const build = ({
  color,
  mode = 'static',
  colorVariant = 'normal',
  coloringStyle = 'filled',
  bordered = false,
  elevated = false,
}: ColoringBuildParams): ColoringDataAttributes => ({
  ...dataColor(color),
  ...dataColoringMode(mode),
  ...dataColorVariant(colorVariant),
  ...dataColoringStyle(coloringStyle),
  ...dataBordered(bordered),
  ...dataElevated(elevated),
} as ColoringDataAttributes)

export const ColoringUtils = {
  colors: coloringColors,
  modes: coloringModes,
  colorVariants: coloringColorVariants,
  styles: coloringStyles,
  dataColor,
  dataColoringMode,
  dataColorVariant,
  dataColoringStyle,
  dataBordered,
  dataElevated,
  build,
}
