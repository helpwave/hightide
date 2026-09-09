import { HexColorUtils } from '../utils/hex'
import {
  stateful,
  tokenColorLightness,
  tokenColorOpacity,
  tokenParameter,
  tokenVariable,
  whenConfig
} from '../component-tokens/builders'
import type { ResolvableColor } from '../component-tokens/resolvable'
import type {
  ButtonVariant,
  ChipVariant,
  ColoringColorVariant,
  ColoringStyle,
  IconButtonVariant,
  PressableButtonColoringConfig
} from './types'

export type ButtonVariantMapping = {
  colorVariant: ColoringColorVariant,
  style: ColoringStyle,
  bordered: boolean,
  elevated: boolean,
}

export const buttonVariantMapping = {
  elevated: {
    colorVariant: 'normal',
    style: 'filled',
    bordered: false,
    elevated: true,
  },
  filled: {
    colorVariant: 'normal',
    style: 'filled',
    bordered: false,
    elevated: false,
  },
  tonal: {
    colorVariant: 'tonal',
    style: 'filled',
    bordered: false,
    elevated: false,
  },
  outlined: {
    colorVariant: 'normal',
    style: 'foreground',
    bordered: true,
    elevated: false,
  },
  foreground: {
    colorVariant: 'normal',
    style: 'foreground',
    bordered: false,
    elevated: false,
  },
} as const satisfies Record<ButtonVariant, ButtonVariantMapping>

export const mapButtonVariant = (
  variant: ButtonVariant
): ButtonVariantMapping => buttonVariantMapping[variant]

export const mapIconButtonVariant = (
  variant: IconButtonVariant
): ButtonVariantMapping => mapButtonVariant(variant)

export const chipVariantMapping = {
  filled: {
    colorVariant: 'normal',
    style: 'filled',
  },
  tonal: {
    colorVariant: 'tonal',
    style: 'filled',
  },
} as const satisfies Record<ChipVariant, { colorVariant: ColoringColorVariant, style: ColoringStyle }>

export const mapChipVariant = (
  variant: ChipVariant
): { colorVariant: ColoringColorVariant, style: ColoringStyle } => chipVariantMapping[variant]

const buttonVariants = [
  'elevated',
  'filled',
  'tonal',
  'outlined',
  'foreground',
] as const satisfies readonly ButtonVariant[]

const variantsMatching = (
  match: (mapping: ButtonVariantMapping) => boolean
): ReadonlyArray<ButtonVariant> => (
  buttonVariants.filter((variant) => match(buttonVariantMapping[variant]))
)

export const buttonVariantsWithColorVariant = (
  colorVariant: ColoringColorVariant
): ReadonlyArray<ButtonVariant> => (
  variantsMatching((mapping) => mapping.colorVariant === colorVariant)
)

export const buttonVariantsWithStyle = (
  style: ColoringStyle
): ReadonlyArray<ButtonVariant> => (
  variantsMatching((mapping) => mapping.style === style)
)

const whenVariants = <V>(
  variants: ReadonlyArray<ButtonVariant>,
  value: V
) => variants.map((variant) => whenConfig({ variant }, value))

const colorPairColor = tokenParameter(
  'params.colorPair.color',
  tokenVariable('theme.color.primary.color')
)
const colorPairOnColor = tokenParameter(
  'params.colorPair.onColor',
  tokenVariable('theme.color.primary.onColor')
)

const tonalColor = tokenColorLightness(
  colorPairColor,
  tokenVariable('theme.config.coloring.tonal.color')
)
const tonalOnColor = tokenColorLightness(
  colorPairColor,
  tokenVariable('theme.config.coloring.tonal.onColor')
)
const transparentColor = tokenColorOpacity(
  colorPairColor,
  tokenVariable('theme.config.coloring.transparent.color')
)
const transparentOnColor = tokenColorOpacity(
  colorPairColor,
  tokenVariable('theme.config.coloring.transparent.onColor')
)

const tonalColorVariants = buttonVariantsWithColorVariant('tonal')
const foregroundStyleVariants = buttonVariantsWithStyle('foreground')

export const coloringVariantTokens = {
  color: stateful<string, ResolvableColor<string, string>, PressableButtonColoringConfig>(
    colorPairColor,
    [
      whenConfig({ coloringColorVariant: 'tonal' }, tonalColor),
      ...whenVariants(tonalColorVariants, tonalColor),
      whenConfig({ coloringColorVariant: 'transparent' }, transparentColor),
    ]
  ),
  onColor: stateful<string, ResolvableColor<string, string>, PressableButtonColoringConfig>(
    colorPairOnColor,
    [
      whenConfig({ coloringColorVariant: 'tonal' }, tonalOnColor),
      ...whenVariants(tonalColorVariants, tonalOnColor),
      whenConfig({ coloringColorVariant: 'transparent' }, transparentOnColor),
    ]
  ),
  accent: stateful<string, ResolvableColor<string, string>, PressableButtonColoringConfig>(
    colorPairColor
  ),
} as const

const foregroundStyleColor = tokenParameter(
  'params.coloring.color',
  tokenVariable('semantics.coloringVariant.color')
)
const filledStyleForeground = tokenParameter(
  'params.coloring.onColor',
  tokenVariable('semantics.coloringVariant.onColor')
)
const foregroundStyleBackground = { value: HexColorUtils.transparent }

export const coloringStyleTokens = {
  foreground: stateful<string, ResolvableColor<string, string>, PressableButtonColoringConfig>(
    filledStyleForeground,
    [
      whenConfig({ coloringStyle: 'foreground' }, foregroundStyleColor),
      ...whenVariants(foregroundStyleVariants, foregroundStyleColor),
    ]
  ),
  background: stateful<string, ResolvableColor<string, string>, PressableButtonColoringConfig>(
    tokenParameter(
      'params.coloring.color',
      tokenVariable('semantics.coloringVariant.color')
    ),
    [
      whenConfig({ coloringStyle: 'foreground' }, foregroundStyleBackground),
      ...whenVariants(foregroundStyleVariants, foregroundStyleBackground),
    ]
  ),
  accent: stateful<string, ResolvableColor<string, string>, PressableButtonColoringConfig>(
    tokenParameter(
      'params.coloring.accent',
      tokenVariable('semantics.coloringVariant.accent')
    )
  ),
} as const
