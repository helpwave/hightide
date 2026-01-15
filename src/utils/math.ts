export type Range = [number, number]
export type UnBoundedRange = [undefined | number, undefined | number]

function clamp(value: number, min: number, max: number): number
function clamp(value: number, range?: [number, number]): number
function clamp(value: number, arg2?: number | [number, number], arg3?: number): number {
  let min: number
  let max: number

  if (Array.isArray(arg2)) {
    [min, max] = arg2
  } else {
    min = arg2 ?? 0
    max = arg3 ?? 1
  }

  return Math.min(Math.max(value, min), max)
}

export const MathUtil = {
  clamp,
}
