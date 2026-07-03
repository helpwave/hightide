import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { StepperLoopEvent } from '@/src/components/user-interaction/input/stepperNumberInputUtils'
import {
  detectStepperLoopEvent,
  resolveStepperLoopingDisplayValue
} from '@/src/components/user-interaction/input/stepperNumberInputUtils'
import type { DirectionNumber } from '../utils/math'
import { CurveBuilderUtil, ExponentialRateCurveBuilder } from '../utils/curves'

export type ChangeRateCurveProps = {
  multiplier?: number,
  minimum?: number,
  maximum?: number,
}

type UseResolveChangeRateCurveResult = RefObject<{
  /**
   * Input: Current Step
   * Result: Steps per second
   */
  curve: (steps: number) => number,
}>

const useResolveChangeRateCurve = (changeRateCurveProps?: ChangeRateCurveProps, minimum?: number, maximum?: number) => {
  const props: ChangeRateCurveProps = useMemo(() => {
    let defaultMax = Infinity
    if(minimum !== undefined && maximum !== undefined ) {
      if(minimum > maximum) {
        throw new Error(`Invalid minimum and maximum: ${minimum} > ${maximum}`)
      }
      if(isNaN(minimum) || !isFinite(minimum)) {
        throw new Error(`Invalid minimum: ${minimum}`)
      }
      if(isNaN(maximum) || !isFinite(maximum)) {
        throw new Error(`Invalid maximum: ${maximum}`)
      }
      defaultMax = maximum
    }
    return {
      basis: 1.5,
      multiplier: changeRateCurveProps?.multiplier ?? 5,
    }
  }, [changeRateCurveProps?.multiplier, maximum, minimum])

  const curve = useMemo(() => CurveBuilderUtil.ExponentialRateCurveBuilder(props), [props])

  const result: UseResolveChangeRateCurveResult = useRef({ curve, props: props })

  useEffect(() => {
    result.current.curve = curve
    result.current.props = props
  }, [curve, props])

  return result
}

type HoldState = {
  direction: DirectionNumber,
  startTime: number,
  lastTimestamp: number,
  lastValue: number,
  lastStep: number,
}

type UseStepperHoldOptions = {
  disabled?: boolean,
  minimum?: number,
  maximum?: number,
  isLooping?: boolean,
  displayedValue: number,
  stepSize?: number,
  changeRateCurveProps?: StepChangeRateCurveBuilderProps,
  onValueChange: (value: number) => void,
  onLooped?: (event: StepperLoopEvent) => void,
}

export function useStepperHold({
  disabled = false,
  minimum,
  maximum,
  isLooping: looping = false,
  displayedValue,
  stepSize: step = 1,
  changeRateCurveProps,
  onValueChange,
  onLooped,
}: UseStepperHoldOptions) {
  const holdStateRef = useRef<HoldState | null>(null)
  const animationFrameRef = useRef<number>(0)
  const displayedValueRef = useRef(displayedValue)
  const onValueChangeRef = useRef(onValueChange)
  const loopingRef = useRef(looping)
  const onLoopedRef = useRef(onLooped)

  const changeRateCurveRef = useResolveChangeRateCurve(changeRateCurveProps, minimum, maximum)
  displayedValueRef.current = displayedValue
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

  const tick = useCallback((timestamp: number) => {
    const holdState = holdStateRef.current
    if (!holdState) {
      return
    }

    const secondsSinceStart = (timestamp - holdState.startTime) / 1000
    const lastStepTime = holdState.lastStep * changeRateCurveRef.current.props.stepLength
    const deltaTime = holdState.lastTimestamp
      ? Math.max(0, (timestamp - holdState.lastTimestamp) / 1000)
      : 0
    holdState.lastTimestamp = timestamp

    const changePerSecond = changeRateCurveRef.current.curve(secondsSinceStart) * holdState.direction

    if (!Number.isFinite(changePerSecond)) {
      stopHold()
      return
    }

    if (!loopingRef.current) {
      if (holdState.direction > 0 && maximum !== undefined && holdState.lastValue >= maximum) {
        holdState.lastValue = maximum
        onValueChangeRef.current(maximum)
        stopHold()
        return
      }

      if (holdState.direction < 0 && minimum !== undefined && holdState.lastValue <= minimum) {
        holdState.lastValue = minimum
        onValueChangeRef.current(minimum)
        stopHold()
        return
      }
    }

    holdState.lastValue += changePerSecond * deltaTime

    if (!Number.isFinite(holdState.animationValue)) {
      stopHold()
      return
    }

    let loopEvent: StepperLoopEvent | undefined

    if (loopingRef.current && minimum !== undefined && maximum !== undefined) {
      const previousAnimationValue = holdState.animationValue - (changePerSecond * deltaTime)
      loopEvent = detectStepperLoopEvent(
        previousAnimationValue,
        holdState.animationValue,
        minimum,
        maximum
      )
    }

    if (!loopingRef.current) {
      if (maximum !== undefined && holdState.animationValue > maximum) {
        holdState.animationValue = maximum
        onValueChangeRef.current(maximum)
        stopHold()
        return
      }

      if (minimum !== undefined && holdState.animationValue < minimum) {
        holdState.animationValue = minimum
        onValueChangeRef.current(minimum)
        stopHold()
        return
      }
    }

    const displayValue = resolveStepperLoopingDisplayValue(
      holdState.animationValue,
      minimum,
      maximum,
      loopingRef.current
    )

    onValueChangeRef.current(displayValue)

    if (loopEvent) {
      onLoopedRef.current?.(loopEvent)
    }

    animationFrameRef.current = requestAnimationFrame(tick)
  }, [maximum, minimum, stopHold])

  const startHold = useCallback((direction: DirectionNumber) => {
    if (disabled) {
      return
    }

    stopHold()

    const startValue = displayedValueRef.current
    const nextAnimationValue = startValue + step * direction
    const loopEvent = loopingRef.current && minimum !== undefined && maximum !== undefined
      ? detectStepperLoopEvent(startValue, nextAnimationValue, minimum, maximum)
      : undefined

    onValueChangeRef.current(resolveStepperLoopingDisplayValue(
      nextAnimationValue,
      minimum,
      maximum,
      loopingRef.current
    ))

    if (loopEvent) {
      onLoopedRef.current?.(loopEvent)
    }

    holdStateRef.current = {
      delta: direction,
      startTime: performance.now(),
      startValue,
      animationValue: nextAnimationValue,
      lastTimestamp: 0,
    }

    animationFrameRef.current = requestAnimationFrame(tick)
  }, [disabled, step, stopHold, tick])

  useEffect(() => stopHold, [stopHold])

  return {
    startHold,
    stopHold,
  }
}

