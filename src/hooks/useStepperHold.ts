import { useCallback, useEffect, useRef } from 'react'
import type { StepperChangeRate, StepperLoopEvent } from '@/src/components/user-interaction/input/stepperNumberInputUtils'
import {
  defaultStepperChangeRate,
  detectStepperLoopEvent,
  resolveStepperLoopingDisplayValue
} from '@/src/components/user-interaction/input/stepperNumberInputUtils'

type UseStepperHoldOptions = {
  disabled?: boolean,
  minimum?: number,
  maximum?: number,
  looping?: boolean,
  displayedValue: number,
  step?: number,
  changeRate?: StepperChangeRate,
  onValueChange: (value: number) => void,
  onLooped?: (event: StepperLoopEvent) => void,
}

export function useStepperHold({
  disabled = false,
  minimum,
  maximum,
  looping = false,
  displayedValue,
  step = 1,
  changeRate = defaultStepperChangeRate,
  onValueChange,
  onLooped,
}: UseStepperHoldOptions) {
  const holdStateRef = useRef<{
    delta: number,
    startTime: number,
    startValue: number,
    animationValue: number,
    lastTimestamp: number,
  } | null>(null)
  const animationFrameRef = useRef<number>(0)
  const displayedValueRef = useRef(displayedValue)
  const onValueChangeRef = useRef(onValueChange)
  const changeRateRef = useRef(changeRate)
  const loopingRef = useRef(looping)
  const onLoopedRef = useRef(onLooped)

  displayedValueRef.current = displayedValue
  onValueChangeRef.current = onValueChange
  changeRateRef.current = changeRate
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
    const deltaTime = holdState.lastTimestamp
      ? Math.max(0, (timestamp - holdState.lastTimestamp) / 1000)
      : 0
    holdState.lastTimestamp = timestamp

    const changePerSecond = changeRateRef.current({
      minimum,
      maximum,
      displayedValue: displayedValueRef.current,
      animationValue: holdState.animationValue,
      secondsSinceStart,
      startValue: holdState.startValue,
      delta: holdState.delta,
    })

    if (!Number.isFinite(changePerSecond)) {
      stopHold()
      return
    }

    if (!loopingRef.current) {
      if (holdState.delta > 0 && maximum !== undefined && holdState.animationValue >= maximum) {
        holdState.animationValue = maximum
        onValueChangeRef.current(maximum)
        stopHold()
        return
      }

      if (holdState.delta < 0 && minimum !== undefined && holdState.animationValue <= minimum) {
        holdState.animationValue = minimum
        onValueChangeRef.current(minimum)
        stopHold()
        return
      }
    }

    holdState.animationValue += changePerSecond * deltaTime

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

  const startHold = useCallback((delta: number) => {
    if (disabled) {
      return
    }

    stopHold()

    const startValue = displayedValueRef.current
    const nextAnimationValue = startValue + step * delta
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
      delta,
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
