import type React from 'react'
import { useMemo, useState } from 'react'
import { resolveSetState } from '../utils/resolveSetState'
import { useLogOnce } from './useLogOnce'

export interface ControlledStateProps<T> {
    value?: T,
    onValueChange?: (value: T) => void,
    defaultValue?: T,
    isControlled?: boolean,
}

export const useControlledState = <T>({
  value,
  onValueChange,
  defaultValue,
  isControlled: isEnforcingControlled
}: ControlledStateProps<T>) : [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [internalValue, setInternalValue] = useState(defaultValue)

  const isControlled = isEnforcingControlled || value !== undefined

  const initialValue = useMemo(() => {
    return value
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLogOnce(
    'useControlledState: changed from uncontrolled to controlled state. Either don\'t '
    +'provide a undefined value or set isControlled to true',
    initialValue === undefined && value !== undefined
  )

  if(isControlled) {
    return [value, onValueChange]
  }

  const onChangeWrapper: React.Dispatch<React.SetStateAction<T>> = (action) => {
    const resolved = resolveSetState(action, internalValue)
    setInternalValue(resolved)
    onValueChange?.(resolved)
  }

  return [internalValue, onChangeWrapper]
}