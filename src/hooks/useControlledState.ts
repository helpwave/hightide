import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { resolveSetState } from '../utils/resolveSetState'
import { useEventCallbackStabilizer } from './useEventCallbackStabelizer'
import { useLogOnce } from './useLogOnce'

export interface ControlledStateProps<T> {
  /**
   * The controlled value of the state.
   *
   * This is determines whether the state:
   * 1. (value !== undefined) => controlled
   * 2. (value === undefined) => uncontrolled
   *
   * If you need to include undefined as a valid state, you can set isControlled to true to force the component to be controlled.
   */
  value?: T,
  /** The callback whenever a setter changes the value */
  onValueChange?: (value: T) => void,
  /** The default value to use if the component is uncontrolled */
  defaultValue?: T,
  /** Forces the component to be controlled even if value is undefined */
  isControlled?: boolean,
}

export const useControlledState = <T>({
  value: controlledValue,
  onValueChange,
  defaultValue,
  isControlled: isEnforcingControlled
}: ControlledStateProps<T>) : [T, React.Dispatch<React.SetStateAction<T>>, boolean] => {
  const [internalValue, setInternalValue] = useState(() => defaultValue)
  const [isControlled] = useState(isEnforcingControlled || controlledValue !== undefined)

  const onValueChangeStable = useEventCallbackStabilizer(onValueChange)

  useLogOnce(
    'useControlledState: Attempted to change from controlled to uncontrolled or vice versa.'
    + 'For a controlled state: isControlled === true OR value !== undefined'
    + 'For an uncontrolled state: isControlled === false OR value === undefined',
    isControlled !== (isEnforcingControlled || controlledValue !== undefined),
    { type: 'error' }
  )

  const lastValue = useRef(isControlled ? controlledValue : internalValue)

  useEffect(() => {
    lastValue.current = isControlled ? controlledValue : internalValue
  }, [isControlled, controlledValue, internalValue])

  const setState: React.Dispatch<React.SetStateAction<T>> = useCallback((action) => {
    const resolved = resolveSetState(action, lastValue.current)
    if(resolved === lastValue.current) return
    if(!isControlled)  {
      lastValue.current = resolved
      setInternalValue(resolved)
    }
    onValueChangeStable(resolved)
  }, [onValueChangeStable, isControlled])

  const value = isControlled ? controlledValue : internalValue

  return [value, setState, isControlled]
}