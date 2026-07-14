import { useCallback, useEffect, useRef } from 'react'

export function useThrottle(throttleMs = 300) {
  const lastRunRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingCallbackRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const withThrottle = useCallback((callback: () => void, throttleMsOverride?: number) => {
    const ms = throttleMsOverride ?? throttleMs
    const now = performance.now()
    const timeSinceLastRun = lastRunRef.current !== null ? now - lastRunRef.current : Infinity

    const run = (fn: () => void) => {
      lastRunRef.current = performance.now()
      pendingCallbackRef.current = null
      fn()
    }

    if (timeSinceLastRun >= ms) {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      run(callback)
      return
    }

    pendingCallbackRef.current = callback

    if (timerRef.current !== null) {
      return
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null
      const pending = pendingCallbackRef.current
      if (pending !== null) {
        run(pending)
      }
    }, ms - timeSinceLastRun)
  }, [throttleMs])

  return withThrottle
}
