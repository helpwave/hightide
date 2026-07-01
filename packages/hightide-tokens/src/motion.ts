/**
 * Motion tokens (animation durations in ms).
 *
 * Transcribed from `theme/variables.css`. Enter animations are slightly slower
 * than exit animations, matching the web library.
 */
export const durations = {
  in: 250,
  out: 170,
} as const

export type DurationName = keyof typeof durations
