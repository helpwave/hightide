import type { KeyboardEvent } from 'react'
import { useCallback, useRef } from 'react'
import { useDelay } from './useDelay'
import { useStableEvent } from './useStableEvent'

export type UseEditCompletableProps<T> = {
  value: T,
  onEditComplete?: (value: T) => void,
  delay?: number,
  isTimerEnabled?: boolean,
  completeKey?: string,
}

export type UseEditCompletableResult = {
  setTimer: () => void,
  completeOnKey: (event: KeyboardEvent) => boolean,
  completeNow: () => void,
}

export function useEditCompletable<T>({
  value,
  onEditComplete,
  delay = 2500,
  isTimerEnabled = true,
  completeKey = 'Enter',
}: UseEditCompletableProps<T>): UseEditCompletableResult {
  const valueRef = useRef(value)
  valueRef.current = value
  const onEditCompleteStable = useStableEvent(onEditComplete)

  const completeEdit = useCallback(() => {
    onEditCompleteStable(valueRef.current)
  }, [onEditCompleteStable])

  const { restartTimer, clearTimer } = useDelay({
    delay,
    disabled: !isTimerEnabled,
  })

  const setTimer = useCallback(() => {
    restartTimer(completeEdit)
  }, [completeEdit, restartTimer])

  const completeOnKey = useCallback((event: KeyboardEvent) => {
    if (event.key !== completeKey || event.shiftKey) {
      return false
    }
    event.preventDefault()
    clearTimer()
    completeEdit()
    return true
  }, [clearTimer, completeEdit, completeKey])

  const completeNow = useCallback(() => {
    clearTimer()
    completeEdit()
  }, [clearTimer, completeEdit])

  return {
    setTimer,
    completeOnKey,
    completeNow,
  }
}
