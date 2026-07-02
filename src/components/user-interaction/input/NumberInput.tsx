import type { CSSProperties, InputHTMLAttributes } from 'react'
import { forwardRef, useCallback, useRef } from 'react'
import clsx from 'clsx'
import type { FormFieldInteractionStates } from '../../form/FieldLayout'
import type { FormFieldDataHandling } from '../../form/FormField'
import { PropsUtil } from '@/src/utils/propsUtil'
import { useControlledState } from '@/src/hooks/useControlledState'
import { ReactRefsUtil } from '@/src/utils/reactRefs'
import {
  commitNumberInputValue,
  normalizeStepperInput
} from './stepperNumberInputUtils'

export type NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'type' | 'min' | 'max' | 'step'>
  & Partial<FormFieldInteractionStates>
  & Partial<FormFieldDataHandling<number>>
  & {
    'initialValue'?: number,
    'minimum'?: number,
    'maximum'?: number,
    'looping'?: boolean,
    'approximateMaxCharacters'?: number,
    'formatDisplayedValue'?: (value: number) => string,
    'parseDisplayedValue'?: (rawValue: string) => number | undefined,
    'data-name'?: string,
  }

/**
 * A number input with configurable width and range validation
 *
 * Its state is managed by the parent
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput({
  value: controlledValue,
  initialValue = 0,
  onValueChange,
  onEditComplete,
  minimum,
  maximum,
  looping = false,
  approximateMaxCharacters = 6,
  formatDisplayedValue,
  parseDisplayedValue,
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
  className,
  style,
  ...props
}, forwardedRef) {
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })
  const innerRef = useRef<HTMLInputElement>(null)
  const valueRef = useRef(value)
  valueRef.current = value

  const commitValue = useCallback((nextValue: number) => {
    const resolved = commitNumberInputValue(nextValue, minimum, maximum, looping)
    setValue(resolved)
    onEditComplete?.(resolved)
    return resolved
  }, [looping, maximum, minimum, onEditComplete, setValue])

  return (
    <input
      {...props}
      ref={ReactRefsUtil.assingRefsBuilder([innerRef, forwardedRef])}
      type="text"
      inputMode="numeric"
      pattern="[0-9-]*"
      value={Number.isFinite(value) ? (formatDisplayedValue?.(Math.round(value)) ?? String(Math.round(value))) : ''}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      min={minimum}
      max={maximum}
      onChange={(event) => {
        props.onChange?.(event)
        const normalized = parseDisplayedValue?.(event.target.value)
          ?? normalizeStepperInput(event.target.value, minimum, maximum, looping)
        if (normalized === undefined) {
          return
        }
        setValue(normalized)
      }}
      onBlur={(event) => {
        props.onBlur?.(event)
        commitValue(valueRef.current)
      }}
      data-name="number-input"
      data-value={PropsUtil.dataAttributes.bool(Number.isFinite(value))}
      {...PropsUtil.dataAttributes.interactionStates({ disabled, invalid, readOnly, required })}
      {...PropsUtil.aria.interactionStates({ disabled, invalid, readOnly, required }, props)}
      className={clsx('number-input-field', className)}
      style={{
        ...style,
        '--number-input-approximate-max-characters': approximateMaxCharacters,
      } as CSSProperties}
    />
  )
})
