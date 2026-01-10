export type Range = [number, number]
export type UnBoundedRange = [undefined | number, undefined | number]

export const clamp = (value: number, range: [number, number] = [0, 1]): number => {
  const [min, max] = range
  return Math.min(Math.max(value, min), max)
}

export const MathUtil = {
  clamp,
}
