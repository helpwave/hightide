import { getSemanticColors } from '../theme'
import { componentLayouts } from '../../tokens'
import type { ColorValue, ElementSize, ThemeMode } from '../../types'
import { hexToRgba } from '../color'
import { toPx } from '../units'

export const coloringColors = ['primary', 'secondary', 'positive', 'warning', 'negative', 'neutral'] as const

export type ColoringColor = typeof coloringColors[number]

export type ButtonColoringStyle = 'outline' | 'solid' | 'text' | 'tonal' | 'tonal-outline'

export type ChipColoringStyle = 'solid' | 'tonal' | 'outline' | 'tonal-outline'

export type ColoringStyle = ButtonColoringStyle

export type ColoringTokens = {
  color: ColorValue,
  onColor: ColorValue,
  hover: ColorValue,
  text?: ColorValue,
  textHover?: ColorValue,
  outline?: ColorValue,
  outlineHover?: ColorValue,
  tonalText?: ColorValue,
  tonalBackground?: ColorValue,
}

export type ResolvedColoringStyles = {
  backgroundColor: string,
  color: ColorValue,
  borderColor?: ColorValue,
  borderWidth?: number,
}

export const getColoringTokens = (color: ColoringColor, mode: ThemeMode): ColoringTokens => {
  const semantic = getSemanticColors(mode)

  if (color === 'neutral') {
    return {
      color: semantic.neutral,
      onColor: semantic.onNeutral,
      hover: semantic.neutralHover,
      text: semantic.neutralText,
      textHover: semantic.neutralTextHover,
      outline: semantic.neutralOutline,
      outlineHover: semantic.neutralOutlineHover,
      tonalText: semantic.neutralTonalText,
      tonalBackground: semantic.neutralTonalBackground,
    }
  }

  const colorKey = color as 'primary' | 'secondary' | 'positive' | 'warning' | 'negative'
  const onColorKey = `on${colorKey.charAt(0).toUpperCase()}${colorKey.slice(1)}` as keyof typeof semantic
  const hoverKey = `${colorKey}Hover` as keyof typeof semantic

  return {
    color: semantic[colorKey],
    onColor: semantic[onColorKey] as ColorValue,
    hover: semantic[hoverKey] as ColorValue,
  }
}

export const resolveColoringStyles = (
  tokens: ColoringTokens,
  coloringStyle: ColoringStyle,
  mode: ThemeMode,
  disabled = false,
): ResolvedColoringStyles => {
  const semantic = getSemanticColors(mode)
  const outlineWidth = toPx(componentLayouts.shared.coloringOutlineWidth)

  if (disabled) {
    return {
      backgroundColor: semantic.disabled,
      color: semantic.onDisabled,
    }
  }

  switch (coloringStyle) {
  case 'solid':
    return {
      backgroundColor: tokens.color,
      color: tokens.onColor,
    }
  case 'text':
    return {
      backgroundColor: 'transparent',
      color: tokens.text ?? tokens.color,
    }
  case 'outline':
    return {
      backgroundColor: 'transparent',
      color: tokens.outline ?? tokens.color,
      borderColor: tokens.outline ?? tokens.color,
      borderWidth: outlineWidth,
    }
  case 'tonal':
    return {
      backgroundColor: hexToRgba(tokens.tonalBackground ?? tokens.color, 0.2),
      color: tokens.tonalText ?? tokens.color,
    }
  case 'tonal-outline':
    return {
      backgroundColor: hexToRgba(tokens.tonalBackground ?? tokens.color, 0.2),
      color: tokens.tonalText ?? tokens.color,
      borderColor: tokens.outline ?? tokens.color,
      borderWidth: outlineWidth,
    }
  }
}
