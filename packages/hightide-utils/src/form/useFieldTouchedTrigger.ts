import { useCallback, useEffect, useRef } from 'react'
import type { InputStateEvent } from '../interfaces/input'
import { useDebouncer } from '../hooks/useDebouncer'
import { useStableEvent } from '../hooks/useStableEvent'
import { useThrottle } from '../hooks/useThrottle'

export type TouchedTrigger<E extends InputStateEvent = InputStateEvent> = {
  event?: ((event: E) => boolean) | null,
  debounce?: number | null,
  throttle?: number | null,
}

const defaultTouchedTriggerDebounce = 1500

export function useFieldTouchedTrigger<E extends InputStateEvent>(
  touchedTrigger: TouchedTrigger<E> | undefined,
  value: unknown,
  markTouched: () => void
): (event: E) => void {
  const matchesEvent = touchedTrigger?.event === undefined ? null : touchedTrigger.event
  const debounce = touchedTrigger?.debounce === undefined ? defaultTouchedTriggerDebounce : touchedTrigger.debounce
  const throttle = touchedTrigger?.throttle === undefined ? null : touchedTrigger.throttle

  const withDebounce = useDebouncer(typeof debounce === 'number' ? debounce : 0)
  const withThrottle = useThrottle(typeof throttle === 'number' ? throttle : 0)
  const markTouchedStable = useStableEvent(markTouched)
  const matchesEventStable = useStableEvent<(event: E) => boolean>(matchesEvent ?? (() => false))
  const previousValueRef = useRef(value)

  useEffect(() => {
    if (Object.is(previousValueRef.current, value)) {
      return
    }
    previousValueRef.current = value
    if (typeof debounce === 'number') {
      withDebounce(markTouchedStable, debounce)
    }
    if (typeof throttle === 'number') {
      withThrottle(markTouchedStable, throttle)
    }
  }, [debounce, markTouchedStable, throttle, value, withDebounce, withThrottle])

  return useCallback((event: E) => {
    if (matchesEvent !== null && matchesEventStable(event)) {
      markTouchedStable()
    }
  }, [markTouchedStable, matchesEvent, matchesEventStable])
}
