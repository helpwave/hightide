export type Range = [number, number]
export type UnBoundedRange = [undefined | number, undefined | number]
export type DirectionNumber = 1 | -1

export type LoopingRangeBound = 'maximum' | 'minimum'

export type LoopingRangeResult = {
  value: number,
  loopedOver: LoopingRangeBound | null,
}

function clamp(value: number, min: number | undefined, max: number | undefined): number {
  if(min !== undefined) value = Math.max(value, min)
  if(max !== undefined) value = Math.min(value, max)
  return value
}

function clamp01(value: number): number {
  return clamp(value, 0, 1)
}

function closestModulo(value: number, modulo: number): number {
  return Math.round(value / modulo) * modulo
}

function toModulo(value: number, modulo: number, min: number | undefined, max: number | undefined): number {
  const minModulo = min !== undefined ? Math.ceil(min / modulo) * modulo : undefined
  const maxModulo = max !== undefined ? Math.floor(max / modulo) * modulo : undefined
  value = closestModulo(value, modulo)
  if(minModulo !== undefined) value = Math.max(value, minModulo)
  if(maxModulo !== undefined) value = Math.min(value, maxModulo)
  return value
}

function resolveLoopingRangeValue(
  value: number,
  minimum: number,
  maximum: number
): LoopingRangeResult {
  const range = maximum - minimum

  if (value > maximum) {
    return {
      value: (value - maximum) % range + minimum,
      loopedOver: 'maximum',
    }
  }

  if (value < minimum) {
    return {
      value: (value - minimum) % range + minimum,
      loopedOver: 'minimum',
    }
  }

  return {
    value,
    loopedOver: null,
  }
}

export const MathUtil = {
  clamp,
  clamp01,
  toModulo,
  closestModulo,
  resolveLoopingRangeValue,
}
