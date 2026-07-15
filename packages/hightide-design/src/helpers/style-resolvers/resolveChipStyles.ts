import { componentLayouts } from '../../tokens'
import type { ElementSize, ThemeMode } from '../../types'
import { toPx } from '../units'
import {
  type ChipColoringStyle,
  type ColoringColor,
  getColoringTokens,
  resolveColoringStyles,
} from './coloring'

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

export const resolveChipStyles = ({
  mode,
  size,
  color,
  coloringStyle,
  disabled = false,
}: ResolveChipStylesOptions): ResolvedChipStyles => {
  const tokens = getColoringTokens(color, mode)
  const coloring = resolveColoringStyles(tokens, coloringStyle, mode, disabled)
  const layout = componentLayouts.chip[size]

  return {
    ...coloring,
    paddingVertical: toPx(layout.paddingVertical),
    paddingHorizontal: toPx(layout.paddingHorizontal),
    gap: toPx(layout.gap),
    borderRadius: toPx(layout.borderRadius),
    minHeight: toPx(layout.minHeight),
    fontSize: toPx(layout.fontSize),
  }
}
