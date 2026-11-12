import { useCallback, useEffect, useRef } from 'react'
import type { InputStateEvent } from '../interfaces/input'
import { useDebouncer } from '../hooks/useDebouncer'
import { useStableEvent } from '../hooks/useStableEvent'
import { useThrottle } from '../hooks/useThrottle'

export type InteractedTrigger<E extends InputStateEvent = InputStateEvent> = {
  event?: ((event: E) => boolean) | null,
  debounce?: number | null,
  throttle?: number | null,
}

const defaultInteractedTriggerDebounce = 1500

export function useFieldInteractedTrigger<E extends InputStateEvent>(
  interactedTrigger: InteractedTrigger<E> | undefined,
  value: unknown,
  markInteracted: () => void
): (event: E) => void {
  const matchesEvent = interactedTrigger?.event === undefined ? null : interactedTrigger.event
  const debounce = interactedTrigger?.debounce === undefined ? defaultInteractedTriggerDebounce : interactedTrigger.debounce
  const throttle = interactedTrigger?.throttle === undefined ? null : interactedTrigger.throttle

  const withDebounce = useDebouncer(typeof debounce === 'number' ? debounce : 0)
  const withThrottle = useThrottle(typeof throttle === 'number' ? throttle : 0)
  const markInteractedStable = useStableEvent(markInteracted)
  const matchesEventStable = useStableEvent<(event: E) => boolean>(matchesEvent ?? (() => false))
  const previousValueRef = useRef(value)

  useEffect(() => {
    if (Object.is(previousValueRef.current, value)) {
      return
    }
    previousValueRef.current = value
    if (typeof debounce === 'number') {
      withDebounce(markInteractedStable, debounce)
    }
    if (typeof throttle === 'number') {
      withThrottle(markInteractedStable, throttle)
    }
  }, [debounce, markInteractedStable, throttle, value, withDebounce, withThrottle])

  return useCallback((event: E) => {
    if (matchesEvent !== null && matchesEventStable(event)) {
      markInteractedStable()
    }
  }, [markInteractedStable, matchesEvent, matchesEventStable])
}
