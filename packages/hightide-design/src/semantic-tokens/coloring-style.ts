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
  SemanticColoringConfig
} from './types'

const colorPairColor = tokenParameter(
  'params.colorPair.color',
  tokenVariable('theme.color.primary.color')
)
const colorPairOnColor = tokenParameter(
  'params.colorPair.onColor',
  tokenVariable('theme.color.primary.onColor')
)

export const coloringVariantTokens = {
  color: stateful<string, ResolvableColor<string, string>, SemanticColoringConfig>(
    colorPairColor,
    [
      whenConfig({ coloringColorVariant: 'tonal' }, tokenColorLightness(
        colorPairColor,
        tokenVariable('theme.config.coloring.tonal.color')
      )),
      whenConfig({ coloringColorVariant: 'transparent' }, tokenColorOpacity(
        colorPairColor,
        tokenVariable('theme.config.coloring.transparent.color')
      )),
    ]
  ),
  onColor: stateful<string, ResolvableColor<string, string>, SemanticColoringConfig>(
    colorPairOnColor,
    [
      whenConfig({ coloringColorVariant: 'tonal' }, tokenColorLightness(
        colorPairColor,
        tokenVariable('theme.config.coloring.tonal.onColor')
      )),
      whenConfig({ coloringColorVariant: 'transparent' }, tokenColorOpacity(
        colorPairColor,
        tokenVariable('theme.config.coloring.transparent.onColor')
      )),
    ]
  ),
  accent: stateful<string, ResolvableColor<string, string>, SemanticColoringConfig>(
    colorPairColor
  ),
} as const

export const coloringStyleTokens = {
  foreground: stateful<string, ResolvableColor<string, string>, SemanticColoringConfig>(
    tokenParameter(
      'params.coloring.onColor',
      tokenVariable('semantics.coloringVariant.onColor')
    ),
    [
      whenConfig(
        { coloringStyle: 'foreground' },
        tokenParameter(
          'params.coloring.color',
          tokenVariable('semantics.coloringVariant.color')
        )
      ),
    ]
  ),
  background: stateful<string, ResolvableColor<string, string>, SemanticColoringConfig>(
    tokenParameter(
      'params.coloring.color',
      tokenVariable('semantics.coloringVariant.color')
    ),
    [
      whenConfig(
        { coloringStyle: 'foreground' },
        { value: HexColorUtils.transparent }
      ),
    ]
  ),
  accent: stateful<string, ResolvableColor<string, string>, SemanticColoringConfig>(
    tokenParameter(
      'params.coloring.accent',
      tokenVariable('semantics.coloringVariant.accent')
    )
  ),
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
