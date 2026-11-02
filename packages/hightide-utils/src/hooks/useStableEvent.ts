import { useCallback, useEffect, useRef } from 'react'

export function useStableEvent<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => any
>(
  callback?: T
): (...args: Parameters<T>) => ReturnType<T> {
  const callbackRef = useRef<T | undefined>(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current?.(...args)
  }, [])
}