import type React from 'react'
import { useEffect, useState } from 'react'
import { resolveSetState } from '@/src/utils/resolveSetState'

export const useOverwritableState = <T>(initialValue?: T, onChange?: (value: T) => void): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(initialValue)

  useEffect(() => {
    setState(initialValue)
  }, [initialValue])

  const onChangeWrapper: React.Dispatch<React.SetStateAction<T>> = (action) => {
    const resolved = resolveSetState(action, state)
    setState(resolved)
    onChange?.(state)
  }

  return [state, onChangeWrapper]
}