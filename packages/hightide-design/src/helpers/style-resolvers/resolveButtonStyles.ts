import { componentLayouts } from '../../tokens'
import type { ElementSize, ThemeMode } from '../../types'
import { toPx } from '../units'
import {
  type ButtonColoringStyle,
  type ColoringColor,
  getColoringTokens,
  resolveColoringStyles
} from './coloring'

export type ResolvedButtonStyles = {
  backgroundColor: string,
  color: string,
  borderColor?: string,
  borderWidth?: number,
  paddingVertical: number,
  paddingHorizontal: number,
  gap: number,
  minWidth: number,
  borderRadius: number,
  minHeight: number,
  fontSize: number,
  iconSize: number,
  iconStrokeWidth: number,
}

export type ResolveButtonStylesOptions = {
  mode: ThemeMode,
  size: ElementSize,
  color: ColoringColor,
  coloringStyle: ButtonColoringStyle,
  disabled?: boolean,
}

const buttonFontSizes: Record<ElementSize, number> = {
  xs: 12,
  sm: 14,
  md: 14,
  lg: 18,
}

const usesOutlinePadding = (coloringStyle: ButtonColoringStyle): boolean => {
  return coloringStyle === 'outline' || coloringStyle === 'tonal-outline'
}

export const resolveButtonStyles = ({
  mode,
  size,
  color,
  coloringStyle,
  disabled = false,
}: ResolveButtonStylesOptions): ResolvedButtonStyles => {
  const tokens = getColoringTokens(color, mode)
  const coloring = resolveColoringStyles(tokens, coloringStyle, mode, disabled)
  const padding = componentLayouts.button[size]
  const sizing = componentLayouts.element[size]
  const icon = componentLayouts.icon[size]
  const outlinePadding = usesOutlinePadding(coloringStyle)

  return {
    ...coloring,
    paddingVertical: toPx(outlinePadding ? padding.paddingYOutline : padding.paddingY),
    paddingHorizontal: toPx(outlinePadding ? padding.paddingXOutline : padding.paddingX),
    gap: toPx(padding.gap),
    minWidth: toPx(padding.minWidth),
    borderRadius: toPx(padding.borderRadius),
    minHeight: toPx(sizing.height),
    fontSize: buttonFontSizes[size],
    iconSize: toPx(icon.size),
    iconStrokeWidth: toPx(icon.strokeWidth),
  }
}

export const resolveIconButtonStyles = ({
  mode,
  size,
  color,
  coloringStyle,
  disabled = false,
}: ResolveButtonStylesOptions): ResolvedButtonStyles => {
  const buttonStyles = resolveButtonStyles({ mode, size, color, coloringStyle, disabled })
  const sizing = componentLayouts.element[size]
  const outlineWidth = toPx(componentLayouts.shared.coloringOutlineWidth)
  const dimension = toPx(sizing.height)

  return {
    ...buttonStyles,
    minWidth: dimension,
    paddingVertical: (dimension - (buttonStyles.borderWidth ?? 0) * 2) / 2,
    paddingHorizontal: (dimension - (buttonStyles.borderWidth ?? 0) * 2) / 2,
    gap: 0,
    borderRadius: toPx(componentLayouts.button[size].borderRadius),
    minHeight: dimension,
    borderWidth: buttonStyles.borderWidth ?? (coloringStyle === 'outline' || coloringStyle === 'tonal-outline' ? outlineWidth : 0),
  }
}
