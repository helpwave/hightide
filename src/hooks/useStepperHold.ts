import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { LoopingRangeResult } from '../utils/math'
import { MathUtil, type DirectionNumber } from '../utils/math'
import type { Curve, ExponentialCurveBuilderProps } from '../utils/curve'
import { CurveBuilderUtil } from '../utils/curve'

export interface StepperLoopEvent {
  value: number,
  direction: DirectionNumber,
  loopedAround: 'maximum' | 'minimum',
}

export type ChangeRateCurveProps = {
  multiplier?: number,
  minimum?: number,
  maximum?: number,
}

type UseResolveChangeRateCurveResult = RefObject<Curve>

const useResolveChangeRateCurve = (changeRateCurveProps?: ChangeRateCurveProps) => {
  const maximum = changeRateCurveProps?.maximum ?? Infinity
  const minimum = changeRateCurveProps?.minimum ?? 0

  if(minimum !== undefined && maximum !== undefined && minimum > maximum) {
    throw new Error(`Invalid minimum and maximum: ${minimum} > ${maximum}`)
  }

  const props: ExponentialCurveBuilderProps = useMemo(() => {
    return {
      basis: 1.5,
      multiplier: changeRateCurveProps?.multiplier ?? 4,
    }
  }, [changeRateCurveProps?.multiplier])

  const curve = useCallback((value: number) => {
    const exponentialFunction = CurveBuilderUtil.ExponentialRateCurveBuilder(props)
    const result = exponentialFunction(value)
    return MathUtil.clamp(result, minimum, maximum)
  }, [maximum, minimum, props])

  const result: UseResolveChangeRateCurveResult = useRef(curve)

  useEffect(() => {
    result.current = curve
  }, [curve, props])

  return result
}

type HoldState = {
  direction: DirectionNumber,
  value: number,
  startTimestamp: number,
  passedTime: number,
  lastStep: number,
}

type UseStepperHoldOptions = {
  disabled?: boolean,
  minimum?: number,
  maximum?: number,
  isLooping?: boolean,
  value: number,
  stepSize?: number,
  stepTime?: number,
  changeRateCurveProps?: ChangeRateCurveProps,
  onValueChange: (value: number) => void,
  onLooped?: (event: StepperLoopEvent) => void,
}

export function useStepperHold({
  disabled = false,
  minimum,
  maximum,
  isLooping: looping = false,
  value,
  stepSize = 1,
  stepTime = 1,
  changeRateCurveProps,
  onValueChange,
  onLooped,
}: UseStepperHoldOptions) {
  const holdStateRef = useRef<HoldState | null>(null)
  const animationFrameRef = useRef<number>(0)
  const valueRef = useRef(value)
  const onValueChangeRef = useRef(onValueChange)
  const loopingRef = useRef(looping)
  const onLoopedRef = useRef(onLooped)

  const changeRateCurveRef = useResolveChangeRateCurve({
    minimum: 0,
    maximum: maximum !== undefined &&  minimum != undefined ? (maximum - minimum) * 0.2 : undefined,
    multiplier: stepSize * 4,
    ...changeRateCurveProps
  })
  valueRef.current = value
  onValueChangeRef.current = onValueChange
  loopingRef.current = looping
  onLoopedRef.current = onLooped

  const stopHold = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = 0
    }
    holdStateRef.current = null
  }, [])

  const validationAndCallbacks = useCallback(() =>  {
    const holdState = holdStateRef.current
    if (!holdState) {
      return
    }

    let shouldStop = false
    let loopingRangeResult: LoopingRangeResult | null = null
    let result = holdState.value

    if (!loopingRef.current) {
      if (holdState.direction > 0 && maximum !== undefined && holdState.value >= maximum) {
        holdState.value = maximum
        shouldStop = true
      }
      if (holdState.direction < 0 && minimum !== undefined && holdState.value <= minimum) {
        holdState.value = minimum
        shouldStop = true
      }
      result = MathUtil.toStepRange(holdState.value, stepSize, minimum, maximum)
    } else {
      if(minimum !== undefined && maximum !== undefined) {
        loopingRangeResult = MathUtil.resolveLoopingRangeValue(holdState.value, minimum, maximum)
      } else {
        loopingRangeResult = { value: MathUtil.clamp(holdState.value, minimum, maximum), loopedOver: null }
      }
      loopingRangeResult.value = MathUtil.toStepRange(loopingRangeResult.value, stepSize, minimum, maximum)
      result = loopingRangeResult.value
    }

    if(shouldStop) stopHold()

    onValueChangeRef.current(result)

    if (loopingRangeResult?.loopedOver) {
      onLoopedRef.current?.({
        direction: holdState.direction,
        loopedAround: loopingRangeResult.loopedOver,
        value: result,
      })
    }
  }, [maximum, minimum, stepSize, stopHold])

  const tick = useCallback((timestamp: number) => {
    const holdState = holdStateRef.current
    if (!holdState) {
      return
    }

    const secondsSinceStart = (timestamp - holdState.startTimestamp) / 1000
    const lastStep = holdState.lastStep
    const step = Math.floor(secondsSinceStart / stepTime)

    let time = holdState.passedTime
    let currentStep = lastStep
    let currentStepDelta = 0

    while(currentStep < step) {
      const currentStepTime = currentStep * stepTime
      currentStepDelta = currentStepTime - time
      const change = holdState.direction * currentStepDelta * changeRateCurveRef.current(currentStep)
      holdState.value += change
      time = currentStepTime
      currentStep++
    }

    currentStepDelta = secondsSinceStart - time
    holdState.value += holdState.direction * currentStepDelta * changeRateCurveRef.current(currentStep)
    holdState.passedTime = secondsSinceStart
    holdState.lastStep = step

    validationAndCallbacks()

    animationFrameRef.current = requestAnimationFrame(tick)
  }, [changeRateCurveRef, stepTime, validationAndCallbacks])

  const startHold = useCallback((direction: DirectionNumber) => {
    if (disabled) {
      return
    }

    stopHold()

    const time = 0
    const step = 0
    const startValue = valueRef.current + direction * stepSize

    holdStateRef.current = {
      direction,
      startTimestamp: performance.now(),
      passedTime: time,
      lastStep: step,
      value: startValue
    }

    validationAndCallbacks()

    animationFrameRef.current = requestAnimationFrame(tick)
  }, [disabled, stepSize, stopHold, tick, validationAndCallbacks])

  useEffect(() => stopHold, [stopHold])

  return {
    startHold,
    stopHold,
  }
}

