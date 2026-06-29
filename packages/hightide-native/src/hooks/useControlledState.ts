import { useCallback, useState } from 'react'

export type ControlledStateOptions<T> = {
  /** When provided (not `undefined`), the value is controlled by the parent. */
  value?: T,
  /** Initial value for the uncontrolled case. */
  defaultValue: T,
  onChange?: (value: T) => void,
}

/**
 * A small controlled/uncontrolled state helper, mirroring the behavior of the
 * web library's `useControlledState` without its logging/stabilizer extras.
 */
export const useControlledState = <T>({
  value,
  defaultValue,
  onChange,
}: ControlledStateOptions<T>): [T, (next: T) => void] => {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState<T>(defaultValue)

  const set = useCallback((next: T) => {
    if (!isControlled) {
      setInternal(next)
    }
    onChange?.(next)
  }, [isControlled, onChange])

  return [isControlled ? value : internal, set]
}
