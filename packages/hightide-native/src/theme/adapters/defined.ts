export const defined = <T extends object>(style: T): T => {
  const result = {} as T

  for (const key of Object.keys(style) as (keyof T)[]) {
    if (style[key] !== undefined) {
      result[key] = style[key]
    }
  }

  return result
}
