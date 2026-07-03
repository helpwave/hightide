import { MathUtil } from '@/src/utils/math'

export type StepperChangeRateContext = {
  minimum?: number,
  maximum?: number,
  displayedValue?: number,
  animationValue?: number,
  secondsSinceStart: number,
  startValue?: number,
  delta: number,
}

export type StepperChangeRate = (context: StepperChangeRateContext) => number

export type StepperLoopEvent = {
  loopedAround: 'maximum' | 'minimum',
  changeDirection: 1 | -1,
}

export function detectStepperLoopEvent(
  previousValue: number,
  nextUnwrappedValue: number,
  minimum: number,
  maximum: number
): StepperLoopEvent | undefined {
  if (nextUnwrappedValue > maximum && previousValue <= maximum) {
    return { loopedAround: 'maximum', changeDirection: 1 }
  }

  if (nextUnwrappedValue < minimum && previousValue >= minimum) {
    return { loopedAround: 'minimum', changeDirection: -1 }
  }

  return undefined
}

export function applyStepperValueWithLoopEvent(
  value: number,
  step: number,
  minimum?: number,
  maximum?: number,
  looping = false
): { value: number, loopEvent?: StepperLoopEvent } {
  const nextUnwrapped = value + step

  if (looping && minimum !== undefined && maximum !== undefined) {
    const loopEvent = detectStepperLoopEvent(value, nextUnwrapped, minimum, maximum)
    return {
      value: applyStepperValue(value, step, minimum, maximum, true),
      loopEvent,
    }
  }

  return {
    value: applyStepperValue(value, step, minimum, maximum, looping),
  }
}

export function integrateDefaultStepperChangeRate(
  secondsSinceStart: number,
  minimum?: number,
  maximum?: number,
  delta = 1
): number {
  if (secondsSinceStart <= 0) {
    return 0
  }

  let elapsed = 0
  let total = 0

  while (elapsed < secondsSinceStart) {
    const segmentIndex = Math.floor(elapsed / defaultStepperDoublingIntervalSeconds)
    const segmentEnd = Math.min(
      secondsSinceStart,
      (segmentIndex + 1) * defaultStepperDoublingIntervalSeconds
    )
    const duration = segmentEnd - elapsed
    const rate = resolveDefaultStepperChangeRateMagnitude(
      segmentIndex * defaultStepperDoublingIntervalSeconds,
      minimum,
      maximum
    )

    total += rate * duration
    elapsed = segmentEnd
  }

  return total * (delta >= 0 ? 1 : -1)
}

export function wrapStepperAnimationValue(
  value: number,
  minimum: number,
  maximum: number
): number {
  const span = maximum - minimum + 1
  if (!Number.isFinite(span) || span <= 0 || !Number.isFinite(value)) {
    return value
  }

  if (value > maximum) {
    const overflow = value - maximum
    const wrappedOverflow = overflow % span
    return minimum + (wrappedOverflow === 0 && overflow !== 0 ? span - 1 : wrappedOverflow)
  }

  if (value < minimum) {
    const underflow = minimum - value
    const wrappedUnderflow = underflow % span
    if (wrappedUnderflow === 0 && underflow !== 0) {
      return minimum
    }
    return maximum - wrappedUnderflow + (wrappedUnderflow === 0 ? 0 : 1)
  }

  return value
}

export function resolveStepperLoopingDisplayValue(
  value: number,
  minimum?: number,
  maximum?: number,
  looping = false
): number {
  if (!looping || minimum === undefined || maximum === undefined) {
    return value
  }

  return wrapStepperAnimationValue(value, minimum, maximum)
}

export function applyStepperValue(
  value: number,
  step: number,
  minimum?: number,
  maximum?: number,
  looping = false
): number {
  const next = value + step

  if (minimum === undefined || maximum === undefined) {
    return next
  }

  if (looping) {
    const span = maximum - minimum + 1
    if (!Number.isFinite(span) || span <= 0) {
      return MathUtil.clamp(next, minimum, maximum)
    }

    const offset = next - minimum
    return minimum + ((offset % span) + span) % span
  }

  return MathUtil.clamp(next, minimum, maximum)
}

export function normalizeStepperInput(
  rawValue: string,
  minimum?: number,
  maximum?: number,
  looping = false
): number | undefined {
  if (rawValue.trim() === '' || rawValue === '-') {
    return undefined
  }

  const parsed = Number(rawValue)
  if (!Number.isFinite(parsed)) {
    return undefined
  }

  if (minimum === undefined || maximum === undefined) {
    return parsed
  }

  if (looping) {
    return applyStepperValue(minimum, parsed - minimum, minimum, maximum, true)
  }

  return MathUtil.clamp(parsed, minimum, maximum)
}

export function commitNumberInputValue(
  value: number,
  minimum?: number,
  maximum?: number,
  looping = false
): number {
  const rounded = Math.round(value)

  if (minimum === undefined || maximum === undefined) {
    return rounded
  }

  if (looping) {
    return Math.round(wrapStepperAnimationValue(rounded, minimum, maximum))
  }

  return MathUtil.clamp(rounded, minimum, maximum)
}
