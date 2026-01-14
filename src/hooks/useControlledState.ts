import type React from 'react'
import { useState } from 'react'
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
  const [isControlled] = useState(isEnforcingControlled || value !== undefined)

  useLogOnce(
    'useControlledState: Attempted to change from controlled to uncontrolled or vice versa.'
    + 'For a controlled state: isControlled === true OR value !== undefined'
    + 'For an uncontrolled state: isControlled === false OR value === undefined',
    isControlled !== (isEnforcingControlled || value !== undefined),
    { type: 'error' }
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