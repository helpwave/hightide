import { buttonPadding } from '../padding'
import { elementSizes, spacing } from '../size'
import type { ElementSize, ThemeMode } from '../types'
import {
  type ButtonColoringStyle,
  type ColoringColor,
  getColoringTokens,
  resolveColoringStyles
} from './coloring'
import { remToPx } from './rem'

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
  const padding = buttonPadding[size]
  const sizing = elementSizes[size]
  const outlinePadding = usesOutlinePadding(coloringStyle)

  return {
    ...coloring,
    paddingVertical: remToPx(outlinePadding ? padding.paddingYOutline : padding.paddingY),
    paddingHorizontal: remToPx(outlinePadding ? padding.paddingXOutline : padding.paddingX),
    gap: remToPx(padding.gap),
    minWidth: remToPx(padding.minWidth),
    borderRadius: remToPx(padding.borderRadius),
    minHeight: remToPx(sizing.height),
    fontSize: buttonFontSizes[size],
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
  const sizing = elementSizes[size]
  const outlineWidth = remToPx(spacing.coloringOutlineWidth)
  const dimension = remToPx(sizing.height)

  return {
    ...buttonStyles,
    minWidth: dimension,
    paddingVertical: (dimension - (buttonStyles.borderWidth ?? 0) * 2) / 2,
    paddingHorizontal: (dimension - (buttonStyles.borderWidth ?? 0) * 2) / 2,
    gap: 0,
    borderRadius: remToPx(buttonPadding[size].borderRadius),
    minHeight: dimension,
    borderWidth: buttonStyles.borderWidth ?? (coloringStyle === 'outline' || coloringStyle === 'tonal-outline' ? outlineWidth : 0),
  }
}
