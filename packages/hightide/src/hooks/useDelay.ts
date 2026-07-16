import { useEffect, useState } from 'react'

export type UseDelayOptionsResolved = {
  delay: number,
  disabled: boolean,
}

export type UseDelayOptions = Partial<UseDelayOptionsResolved>

const defaultOptions: UseDelayOptionsResolved = {
  delay: 3000,
  disabled: false,
}

export function useDelay(options?: UseDelayOptions) {
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const { delay, disabled }: UseDelayOptionsResolved = {
    ...defaultOptions,
    ...options
  }

  const clearTimer = () => {
    clearTimeout(timer)
    setTimer(undefined)
  }

  const restartTimer = (onDelayFinish: () => void) => {
    if(disabled) {
      return
    }
    clearTimeout(timer)
    setTimer(setTimeout(() => {
      onDelayFinish()
      setTimer(undefined)
    }, delay))
  }

  useEffect(() => {
    return () => {
      clearTimeout(timer)
    }
  }, [timer])

  useEffect(() => {
    if(disabled){
      clearTimeout(timer)
      setTimer(undefined)
    }
  }, [disabled, timer])

  return { restartTimer, clearTimer, hasActiveTimer: !!timer }
}