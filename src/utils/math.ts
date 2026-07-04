export type Range = [number, number]
export type UnBoundedRange = [undefined | number, undefined | number]
export type DirectionNumber = 1 | -1

function clamp(value: number, min: number | undefined, max: number | undefined): number {
  if(min !== undefined) value = Math.max(value, min)
  if(max !== undefined) value = Math.min(value, max)
  return value
}

function clamp01(value: number): number {
  return clamp(value, 0, 1)
}

function roundModulo(value: number, modulo: number): number {
  return Math.round(value / modulo) * modulo
}

export const MathUtil = {
  clamp,
  clamp01,
  roundModulo
}
