import type { ElementSize } from './spacing'

/**
 * Border-radius tokens (px).
 *
 * Mirrors the `rounded` / `rounded-md` / `rounded-lg` usage on web and the
 * per-size radii from the `sizing-*` utilities in `theme/element.css`.
 */
export const radii = {
  none: 0,
  sm: 4, // rounded
  md: 6, // rounded-md
  lg: 8, // rounded-lg
  xl: 12,
  '2xl': 16,
  full: 9999,
} as const

export type RadiusName = keyof typeof radii

/** Border radius of an interactive element, per size. */
export const elementRadius: Record<ElementSize, number> = {
  xs: radii.sm, // 4
  sm: radii.md, // 6
  md: radii.md, // 6
  lg: radii.lg, // 8
}
