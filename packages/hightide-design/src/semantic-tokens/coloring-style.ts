import { HexColorUtils } from '../utils/hex'
import {
  tokenColorLightness,
  tokenColorOpacity,
  tokenPath
} from '../component-tokens/builders'
import type {
  ButtonVariant,
  ChipVariant,
  ColoringColorVariant,
  ColoringStyle,
  IconButtonVariant
} from './types'

export const coloringColorVariantTokens = {
  normal: {
    color: tokenPath('params.colorPair.color'),
    onColor: tokenPath('params.colorPair.onColor'),
    accent: tokenPath('params.colorPair.color'),
  },
  tonal: {
    color: tokenColorLightness(
      tokenPath('params.colorPair.color'),
      tokenPath('theme.config.coloring.tonal.color')
    ),
    onColor: tokenColorLightness(
      tokenPath('params.colorPair.color'),
      tokenPath('theme.config.coloring.tonal.onColor')
    ),
    accent: tokenPath('params.colorPair.color'),
  },
  transparent: {
    color: tokenColorOpacity(
      tokenPath('params.colorPair.color'),
      tokenPath('theme.config.coloring.transparent.color')
    ),
    onColor: tokenColorOpacity(
      tokenPath('params.colorPair.color'),
      tokenPath('theme.config.coloring.transparent.onColor')
    ),
    accent: tokenPath('params.colorPair.color'),
  },
} as const

export const coloringStyleTokens = {
  filled: {
    foreground: tokenPath('params.coloring.onColor'),
    background: tokenPath('params.coloring.color'),
    accent: tokenPath('params.coloring.accent'),
  },
  foreground: {
    foreground: tokenPath('params.coloring.color'),
    background: {
      value: HexColorUtils.transparent,
    },
    accent: tokenPath('params.coloring.accent'),
  },
} as const

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
