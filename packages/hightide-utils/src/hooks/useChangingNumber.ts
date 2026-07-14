import { useEffect, useRef, useState } from 'react'
import type { Curve } from '../utils/curve'
import { CurveBuilderUtil } from '../utils/curve'
import { MathUtil } from '../utils/math'

export type UseChangingNumberOptions = {
  start: number,
  end: number,
  animationTime?: number,
  curve?: Curve,
  resetRateAfterUpdate?: boolean,
}

type AnimationState = {
  startTimestamp: number,
}

export function useChangingNumber({
  start,
  end,
  animationTime = 1000,
  curve = CurveBuilderUtil.easeInEaseOut,
  resetRateAfterUpdate = false,
}: UseChangingNumberOptions): number {
  const [displayValue, setDisplayValue] = useState(start)
  const animationStateRef = useRef<AnimationState>({
    startTimestamp: performance.now(),
  })
  const startRef = useRef(start)
  const endRef = useRef(end)
  const curveRef = useRef(curve)
  const animationTimeRef = useRef(animationTime)
  const resetRateAfterUpdateRef = useRef(resetRateAfterUpdate)
  const previousStartRef = useRef(start)
  const previousEndRef = useRef(end)

  startRef.current = start
  endRef.current = end
  curveRef.current = curve
  animationTimeRef.current = animationTime
  resetRateAfterUpdateRef.current = resetRateAfterUpdate

  useEffect(() => {
    const startChanged = previousStartRef.current !== start
    const endChanged = previousEndRef.current !== end

    if (startChanged) {
      setDisplayValue(start)
    }

    if ((startChanged || endChanged) && !resetRateAfterUpdateRef.current) {
      animationStateRef.current.startTimestamp = performance.now()
    }

    previousStartRef.current = start
    previousEndRef.current = end
  }, [start, end])

  useEffect(() => {
    if (start === end) {
      setDisplayValue(end)
      return
    }

    let animationFrame = 0

    const tick = (timestamp: number) => {
      const elapsed = timestamp - animationStateRef.current.startTimestamp
      const progress = MathUtil.clamp01(elapsed / animationTimeRef.current)
      const value = startRef.current + curveRef.current(progress) * (endRef.current - startRef.current)

      setDisplayValue(value)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick)
      } else {
        setDisplayValue(endRef.current)
      }
    }

    animationFrame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [animationTime, curve, end, resetRateAfterUpdate, start])

  return displayValue
}
