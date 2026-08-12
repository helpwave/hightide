import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import type { ThemeTokens } from '../theme-tokens/theme-tokens'
import { HexColorUtils } from '../utils/hex'
import { OKLCHUtils } from '../utils/oklch'
import type {
  ButtonVariant,
  ChipVariant,
  ColoringColorTokens,
  ColoringColorVariant,
  ColoringStyle,
  ColoringToken,
  IconButtonVariant
} from './types'

export const resolveColoringColorVariant = (params: {
  themeTokens?: ThemeTokens,
  colorPair: ColorPairToken,
  variant: ColoringColorVariant,
}): ColoringColorTokens => {
  const { color, onColor } = params.colorPair

  switch (params.variant) {
  case 'normal':
    return {
      color,
      onColor,
      accent: color,
    }
  case 'tonal':
    return {
      color: OKLCHUtils.changeLightness(color, 0.95),
      onColor: OKLCHUtils.changeLightness(color, 0.2),
      accent: color,
    }
  case 'transparent':
    return {
      color: HexColorUtils.hexWithAlpha(color, 0.2),
      onColor,
      accent: color,
    }
  }
}

export const resolveColoringStyle = (params: {
  themeTokens?: ThemeTokens,
  coloring: ColoringColorTokens,
  style: ColoringStyle,
}): ColoringToken => {
  const { color, onColor, accent } = params.coloring

  switch (params.style) {
  case 'filled':
    return {
      foreground: onColor,
      background: color,
      accent,
    }
  case 'foreground':
    return {
      foreground: color,
      background: 'transparent',
      accent,
    }
  }
}

export type ButtonVariantMapping = {
  colorVariant: ColoringColorVariant,
  style: ColoringStyle,
  bordered: boolean,
  elevated: boolean,
}

export const mapButtonVariant = (
  variant: ButtonVariant
): ButtonVariantMapping => {
  switch (variant) {
  case 'elevated':
    return {
      colorVariant: 'normal',
      style: 'filled',
      bordered: false,
      elevated: true,
    }
  case 'filled':
    return {
      colorVariant: 'normal',
      style: 'filled',
      bordered: false,
      elevated: false,
    }
  case 'tonal':
    return {
      colorVariant: 'tonal',
      style: 'filled',
      bordered: false,
      elevated: false,
    }
  case 'outlined':
    return {
      colorVariant: 'normal',
      style: 'foreground',
      bordered: true,
      elevated: false,
    }
  case 'foreground':
    return {
      colorVariant: 'normal',
      style: 'foreground',
      bordered: false,
      elevated: false,
    }
  }
}

export const mapIconButtonVariant = (
  variant: IconButtonVariant
): ButtonVariantMapping => mapButtonVariant(variant)

export const mapChipVariant = (
  variant: ChipVariant
): { colorVariant: ColoringColorVariant, style: ColoringStyle } => {
  switch (variant) {
  case 'filled':
    return {
      colorVariant: 'normal',
      style: 'filled',
    }
  case 'tonal':
    return {
      colorVariant: 'tonal',
      style: 'filled',
    }
  }
}
