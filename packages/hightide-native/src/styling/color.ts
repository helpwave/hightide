/**
 * Small color helpers used to reproduce the web library's tonal/translucent
 * treatments (e.g. `bg-[var(--coloring-color)]/20`) with React Native, which
 * has no concept of a color + opacity utility.
 */

/** Converts a `#RGB` / `#RRGGBB` hex string into its `[r, g, b]` channels. */
const hexToRgb = (hex: string): [number, number, number] | null => {
  let value = hex.trim().replace('#', '')
  if (value.length === 3) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('')
  }
  if (value.length !== 6) {
    return null
  }
  const int = Number.parseInt(value, 16)
  if (Number.isNaN(int)) {
    return null
  }
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
}

/**
 * Returns `color` at the given `alpha` (0–1) as an `rgba(...)` string.
 * Non-hex inputs are returned unchanged so callers can pass through
 * already-translucent values.
 */
export const withOpacity = (color: string, alpha: number): string => {
  const rgb = hexToRgb(color)
  if (!rgb) {
    return color
  }
  const clamped = Math.max(0, Math.min(1, alpha))
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${clamped})`
}
