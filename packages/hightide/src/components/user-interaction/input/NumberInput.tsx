import type { CSSProperties, InputHTMLAttributes } from 'react'
import { forwardRef, useRef } from 'react'
import clsx from 'clsx'
import type { FormFieldInteractionStates } from '../../form/FieldLayout'
import type { FormFieldDataHandling } from '../../form/FormField'
import { PropsUtil } from '@/src/utils/propsUtil'
import { useControlledState } from '@helpwave/hightide-utils'
import { ReactUtils } from '@helpwave/hightide-utils'
import { MathUtil } from '@helpwave/hightide-utils'

export type NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'type' | 'min' | 'max' | 'step'>
  & Partial<FormFieldInteractionStates>
  & Partial<FormFieldDataHandling<number>>
  & {
    initialValue?: number,
    minimum?: number,
    maximum?: number,
    approximateMaxCharacters?: number,
    formatDisplayedValue?: (value: number) => string,
    parseDisplayedValue?: (rawValue: string) => number | undefined,
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

  return (
    <input
      {...props}
      ref={ReactUtils.assingRefsBuilder([innerRef, forwardedRef])}
      type="text"
      inputMode="numeric"
      value={Number.isFinite(value) ? (formatDisplayedValue?.(Math.round(value)) ?? String(Math.round(value))) : ''}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      min={minimum}
      max={maximum}
      onChange={(event) => {
        props.onChange?.(event)
        let normalized = parseDisplayedValue?.(event.target.value) ?? Number(event.target.value)
        normalized = MathUtil.clamp(normalized, minimum, maximum)
        setValue(normalized)
      }}
      onBlur={(event) => {
        props.onBlur?.(event)
        onEditComplete?.(value)
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
