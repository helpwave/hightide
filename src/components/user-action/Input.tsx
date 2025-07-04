import React, { forwardRef, type InputHTMLAttributes, useEffect, useImperativeHandle, useRef, useState } from 'react'
import clsx from 'clsx'
import type { UseDelayOptionsResolved } from '../../hooks/useDelay'
import { useDelay } from '../../hooks/useDelay'
import { noop } from '../../util/noop'
import type { LabelProps } from './Label'
import { Label } from './Label'
import { useFocusManagement } from '../../hooks/useFocusManagement'
import { useFocusOnceVisible } from '../../hooks/useFocusOnceVisible'

type GetInputClassNameProps = {
  disabled?: boolean,
  hasError?: boolean,
}
const getInputClassName = ({ disabled = false, hasError = false }: GetInputClassNameProps) => {
  return clsx(
    'px-2 py-1.5 rounded-md border-2',
    {
      'bg-surface text-on-surface hover:border-primary focus:border-primary': !disabled && !hasError,
      'bg-on-negative text-negative border-negative-border hover:border-negative-border-hover': !disabled && hasError,
      'bg-disabled-background text-disabled-text border-disabled-border': disabled,
    }
  )
}

export type EditCompleteOptionsResolved = {
  onBlur: boolean,
  afterDelay: boolean,
} & Omit<UseDelayOptionsResolved, 'disabled'>

export type EditCompleteOptions = Partial<EditCompleteOptionsResolved>

const defaultEditCompleteOptions: EditCompleteOptionsResolved = {
  onBlur: true,
  afterDelay: true,
  delay: 2500
}

export type InputProps = {
  /**
   * used for the label's `for` attribute
   */
  label?: Omit<LabelProps, 'id'>,
  /**
   * Callback for when the input's value changes
   * This is pretty much required but made optional for the rare cases where it actually isn't need such as when used with disabled
   * That could be enforced through a union type but that seems a bit overkill
   * @default noop
   */
  onChangeText?: (text: string) => void,
  className?: string,
  onEditCompleted?: (text: string) => void,
  allowEnterComplete?: boolean,
  expanded?: boolean,
  containerClassName?: string,
  editCompleteOptions?: EditCompleteOptions,
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'label'>

/**
 * A Component for inputting text or other information
 *
 * Its state is managed must be managed by the parent
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
                                                          id,
                                                          type = 'text',
                                                          value,
                                                          label,
                                                          onChange = noop,
                                                          onChangeText = noop,
                                                          onEditCompleted,
                                                          className = '',
                                                          allowEnterComplete = true,
                                                          expanded = true,
                                                          autoFocus = false,
                                                          onBlur,
                                                          editCompleteOptions,
                                                          containerClassName,
                                                          disabled,
                                                          ...restProps
                                                        }, forwardedRef) {
  const { onBlur: allowEditCompleteOnBlur, afterDelay, delay } = { ...defaultEditCompleteOptions, ...editCompleteOptions }

  const {
    restartTimer,
    clearTimer
  } = useDelay({ delay, disabled: !afterDelay })

  const innerRef = useRef<HTMLInputElement>(null)
  const { focusNext } = useFocusManagement()

  useFocusOnceVisible(innerRef, !autoFocus)
  useImperativeHandle(forwardedRef, () => innerRef.current)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      innerRef.current?.blur()
      focusNext()
    }
  }

  return (
    <div className={clsx({ 'w-full': expanded }, containerClassName)}>
      {label && <Label {...label} htmlFor={id} className={clsx('mb-1', label.className)} />}
      <input
        {...restProps}
        ref={innerRef}
        value={value}
        id={id}
        type={type}
        disabled={disabled}
        className={clsx(getInputClassName({ disabled }), className)}
        onKeyDown={allowEnterComplete ? handleKeyDown : undefined}
        onBlur={event => {
          onBlur?.(event)
          if (onEditCompleted && allowEditCompleteOnBlur) {
            onEditCompleted(event.target.value)
            clearTimer()
          }
        }}
        onChange={e => {
          const value = e.target.value
          if (onEditCompleted) {
            restartTimer(() => {
              if(innerRef.current){
                innerRef.current.blur()
                if(!allowEditCompleteOnBlur) {
                  onEditCompleted(value)
                }
              } else {
                onEditCompleted(value)
              }
            })
          }
          onChange(e)
          onChangeText(value)
        }}
      />
    </div>
  )
})


/**
 * A Component for inputting text or other information
 *
 * Its state is managed by the component itself
 */
const InputUncontrolled = ({
                             value = '',
                             onChangeText = noop,
                             ...props
                           }: InputProps) => {
  const [usedValue, setUsedValue] = useState(value)

  useEffect(() => {
    setUsedValue(value)
  }, [value])

  return (
    <Input
      {...props}
      value={usedValue}
      onChangeText={text => {
        setUsedValue(text)
        onChangeText(text)
      }}
    />
  )
}

export type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string,
  labelText?: string,
  errorText?: string,
  labelClassName?: string,
  errorClassName?: string,
  containerClassName?: string,
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput({
                                                                                    id,
                                                                                    labelText,
                                                                                    errorText,
                                                                                    className,
                                                                                    labelClassName,
                                                                                    errorClassName,
                                                                                    containerClassName,
                                                                                    required,
                                                                                    disabled,
                                                                                    ...restProps
                                                                                  }, ref) {
  const input = (
    <input
      {...restProps}
      ref={ref}
      id={id}
      disabled={disabled}
      className={clsx(
        getInputClassName({ disabled, hasError: !!errorText }),
        className
      )}
    />
  )

  return (
    <div className={clsx('flex flex-col gap-y-1', containerClassName)}>
      {labelText && (
        <label htmlFor={id} className={clsx('textstyle-label-md', labelClassName)}>
          {labelText}
          {required && <span className="text-primary font-bold">*</span>}
        </label>
      )}
      {input}
      {errorText && <label htmlFor={id} className={clsx('text-negative', errorClassName)}>{errorText}</label>}
    </div>
  )
})

export {
  InputUncontrolled,
  Input,
  FormInput
}
