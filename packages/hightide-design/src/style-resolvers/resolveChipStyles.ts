import { elementPadding } from '../padding'
import type { ElementSize, ThemeMode } from '../types'
import {
  type ChipColoringStyle,
  type ColoringColor,
  getColoringTokens,
  resolveColoringStyles
} from './coloring'
import { remToPx } from './rem'

export type ResolvedChipStyles = {
  backgroundColor: string,
  color: string,
  borderColor?: string,
  borderWidth?: number,
  paddingVertical: number,
  paddingHorizontal: number,
  gap: number,
  borderRadius: number,
  minHeight: number,
  fontSize: number,
}

export type ResolveChipStylesOptions = {
  mode: ThemeMode,
  size: ElementSize,
  color: ColoringColor,
  coloringStyle: ChipColoringStyle,
  disabled?: boolean,
}

const chipHeights: Record<ElementSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
}

const chipBorderRadius: Record<ElementSize, number> = {
  xs: 4,
  sm: 6,
  md: 6,
  lg: 6,
}

const chipFontSizes: Record<ElementSize, number> = {
  xs: 14,
  sm: 14,
  md: 14,
  lg: 14,
}

const chipHorizontalPadding: Record<ElementSize, number> = {
  xs: remToPx('0.25rem'),
  sm: remToPx('0.375rem'),
  md: remToPx('0.75rem'),
  lg: remToPx('1rem'),
}

const chipVerticalPadding: Record<ElementSize, number> = {
  xs: remToPx('0.1875rem'),
  sm: remToPx('0.25rem'),
  md: remToPx('0.5rem'),
  lg: remToPx('0.625rem'),
}

export const resolveChipStyles = ({
  mode,
  size,
  color,
  coloringStyle,
  disabled = false,
}: ResolveChipStylesOptions): ResolvedChipStyles => {
  const tokens = getColoringTokens(color, mode)
  const coloring = resolveColoringStyles(tokens, coloringStyle, mode, disabled)

  return {
    ...coloring,
    paddingVertical: chipVerticalPadding[size],
    paddingHorizontal: chipHorizontalPadding[size],
    gap: remToPx(elementPadding[size === 'xs' ? 'xs' : 'sm'].vertical),
    borderRadius: chipBorderRadius[size],
    minHeight: chipHeights[size],
    fontSize: chipFontSizes[size],
  }
}
