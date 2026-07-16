import { useCallback, useEffect, useRef } from 'react'

export function useDebouncer(debounceMs = 300) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const withDebounce = useCallback((callback: () => void, debounceMsOverride?: number) => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      callback()
    }, debounceMsOverride ?? debounceMs)
  }, [debounceMs])

  return withDebounce
}
