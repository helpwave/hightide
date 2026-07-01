import clsx from 'clsx'
import type { ClassValue } from 'clsx'

/**
 * `className` composition helper.
 *
 * The native components style themselves with `StyleSheet` so they work with
 * zero build setup, but they also forward an optional `className`. Consumers
 * who opt into NativeWind can therefore extend any component with utility
 * classes, and this helper keeps that composition tidy.
 */
export const cn = (...inputs: ClassValue[]): string | undefined => {
  const result = clsx(inputs)
  return result.length > 0 ? result : undefined
}
