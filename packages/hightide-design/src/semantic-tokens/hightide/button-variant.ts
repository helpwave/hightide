import { TokenBuilder } from '../../utils'
import type {
  ButtonVariant,
  ChipVariant,
  ColoringColorVariant,
  ColoringStyle,
  IconButtonVariant
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

export const whenVariants = <V>(
  variants: ReadonlyArray<ButtonVariant>,
  value: V
) => variants.map((variant) => TokenBuilder.whenConfig({ variant }, value))
