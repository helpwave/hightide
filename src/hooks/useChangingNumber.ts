import { useEffect, useRef, useState } from 'react'
import type { StepperChangeRate } from '@/src/components/user-interaction/input/stepperNumberInputUtils'
import { defaultStepperChangeRate } from '@/src/components/user-interaction/input/stepperNumberInputUtils'

export type UseChangingNumberOptions = {
  start: number,
  end: number,
  changeRate?: StepperChangeRate,
  resetRateAfterUpdate?: boolean,
}

type AnimationState = {
  animationValue: number,
  startTime: number,
  lastTimestamp: number,
}

export function useChangingNumber({
  start,
  end,
  changeRate = defaultStepperChangeRate,
  resetRateAfterUpdate = false,
}: UseChangingNumberOptions): number {
  const [displayValue, setDisplayValue] = useState(start)
  const animationStateRef = useRef<AnimationState>({
    animationValue: start,
    startTime: performance.now(),
    lastTimestamp: 0,
  })
  const startRef = useRef(start)
  const endRef = useRef(end)
  const changeRateRef = useRef(changeRate)
  const resetRateAfterUpdateRef = useRef(resetRateAfterUpdate)
  const previousStartRef = useRef(start)
  const previousEndRef = useRef(end)

  startRef.current = start
  endRef.current = end
  changeRateRef.current = changeRate
  resetRateAfterUpdateRef.current = resetRateAfterUpdate

  useEffect(() => {
    const startChanged = previousStartRef.current !== start
    const endChanged = previousEndRef.current !== end

    if (startChanged) {
      animationStateRef.current.animationValue = start
      setDisplayValue(start)
    }

    if ((startChanged || endChanged) && !resetRateAfterUpdateRef.current) {
      animationStateRef.current.startTime = performance.now()
      animationStateRef.current.lastTimestamp = 0
    }

    previousStartRef.current = start
    previousEndRef.current = end
  }, [start, end])

  useEffect(() => {
    let animationFrame = 0

    const tick = (timestamp: number) => {
      const animationState = animationStateRef.current
      const targetEnd = endRef.current
      const animationStart = startRef.current
      const delta = targetEnd === animationState.animationValue
        ? 0
        : (targetEnd > animationState.animationValue ? 1 : -1)

      if (delta === 0) {
        setDisplayValue(targetEnd)
        return
      }

      const secondsSinceStart = (timestamp - animationState.startTime) / 1000
      const deltaTime = animationState.lastTimestamp
        ? Math.max(0, (timestamp - animationState.lastTimestamp) / 1000)
        : 0
      animationState.lastTimestamp = timestamp

      const minimum = Math.min(animationStart, targetEnd)
      const maximum = Math.max(animationStart, targetEnd)

      const changePerSecond = changeRateRef.current({
        minimum,
        maximum,
        displayedValue: animationState.animationValue,
        animationValue: animationState.animationValue,
        secondsSinceStart,
        startValue: animationStart,
        delta,
      })

      if (!Number.isFinite(changePerSecond)) {
        return
      }

      animationState.animationValue += changePerSecond * deltaTime

      if (!Number.isFinite(animationState.animationValue)) {
        return
      }

      if (delta > 0 && animationState.animationValue >= targetEnd) {
        animationState.animationValue = targetEnd
        setDisplayValue(targetEnd)
        return
      }

      if (delta < 0 && animationState.animationValue <= targetEnd) {
        animationState.animationValue = targetEnd
        setDisplayValue(targetEnd)
        return
      }

      setDisplayValue(animationState.animationValue)
      animationFrame = requestAnimationFrame(tick)
    }

    animationFrame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [start, end, changeRate, resetRateAfterUpdate])

  return displayValue
}
