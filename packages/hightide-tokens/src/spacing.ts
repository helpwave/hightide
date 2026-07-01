/**
 * Spacing & element-sizing tokens.
 *
 * Transcribed from `theme/variables.css`. The base unit is 4px (`--spacing`).
 * "element" sizes describe the height + padding of interactive controls
 * (buttons, inputs, chips, …) across the four standard sizes.
 *
 * Note: `md` is intentionally >= 44px so touch targets meet accessibility
 * guidance on native by default.
 */

/** Base spacing unit in px (`--spacing: 0.25rem`). */
export const SPACING_UNIT = 4

/** Multiply a number of spacing units by the base unit. */
export const space = (units: number): number => units * SPACING_UNIT

export type ElementSize = 'xs' | 'sm' | 'md' | 'lg'

/** Total height of an interactive element, per size (px). */
export const elementHeight: Record<ElementSize, number> = {
  xs: space(7), // 28
  sm: space(9), // 36
  md: space(11), // 44
  lg: space(13), // 52
}

/** Vertical padding of an interactive element, per size (px). */
export const elementPaddingVertical: Record<ElementSize, number> = {
  xs: (elementHeight.xs - space(4)) / 2, // 6
  sm: (elementHeight.sm - space(6)) / 2, // 6
  md: (elementHeight.md - space(6)) / 2, // 10
  lg: (elementHeight.lg - space(8)) / 2, // 10
}

/** Horizontal padding of an interactive element, per size (px). */
export const elementPaddingHorizontal: Record<ElementSize, number> = {
  xs: elementPaddingVertical.xs * 1.5, // 9
  sm: elementPaddingVertical.sm * 2, // 12
  md: elementPaddingVertical.md * 2, // 20
  lg: elementPaddingVertical.lg * 3, // 30
}

/** Gap between an element's icon and its label, per size (px). */
export const elementGap: Record<ElementSize, number> = {
  xs: space(1), // 4
  sm: space(1), // 4
  md: space(2), // 8
  lg: space(2), // 8
}

/** Width of the focus/outline ring (`--coloring-outline-width`). */
export const outlineWidth = space(0.5) // 2

export const spacingScale = {
  unit: SPACING_UNIT,
  elementHeight,
  elementPaddingVertical,
  elementPaddingHorizontal,
  elementGap,
  outlineWidth,
} as const
