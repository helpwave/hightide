import type React from 'react'
import { useEffect, useState } from 'react'
import { resolveSetState } from '@/src/utils/resolveSetState'

export const useOverwritableState = <T>(overwriteValue?: T, onChange?: (value: T) => void): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(overwriteValue)

  useEffect(() => {
    setState(overwriteValue)
  }, [overwriteValue])

  const onChangeWrapper: React.Dispatch<React.SetStateAction<T>> = (action) => {
    const resolved = resolveSetState(action, state)
    setState(resolved)
    onChange?.(resolved)
  }

  return [state, onChangeWrapper]
}