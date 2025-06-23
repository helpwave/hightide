import React, { forwardRef, type InputHTMLAttributes, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useSaveDelay } from '../../hooks/useSaveDelay'
import { noop } from '../../util/noop'
import type { LabelProps } from './Label'
import { Label } from './Label'

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
  expanded?: boolean,
  containerClassName?: string,
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'label'>

/**
 * A Component for inputting text or other information
 *
 * Its state is managed must be managed by the parent
 */
const Input = ({
                 id,
                 type = 'text',
                 value,
                 label,
                 onChange = noop,
                 onChangeText = noop,
                 onEditCompleted,
                 className = '',
                 expanded = true,
                 autoFocus,
                 onBlur,
                 containerClassName,
                 ...restProps
               }: InputProps) => {
  const {
    restartTimer,
    clearUpdateTimer
  } = useSaveDelay(() => undefined, 3000)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if(autoFocus) {
      ref.current?.focus()
    }
  }, [autoFocus])

  return (
    <div className={clsx({ 'w-full': expanded }, containerClassName)}>
      {label && <Label {...label} htmlFor={id} className={clsx('mb-1', label.className)}/>}
      <input
        ref={ref}
        value={value}
        id={id}
        type={type}
        className={className}
        onBlur={event => {
          if (onBlur) {
            onBlur(event)
          }
          if (onEditCompleted) {
            onEditCompleted(event.target.value)
            clearUpdateTimer()
          }
        }}
        onChange={e => {
          const value = e.target.value
          if (onEditCompleted) {
            restartTimer(() => {
              onEditCompleted(value)
              clearUpdateTimer()
            })
          }
          onChange(e)
          onChangeText(value)
        }}
        {...restProps}
      />
    </div>
  )
}

type InputUncontrolledProps = Omit<InputProps, 'value'> & {
  /**
   * @default ''
   */
  defaultValue?: string,
}

/**
 * A Component for inputting text or other information
 *
 * Its state is managed by the component itself
 */
const InputUncontrolled = ({
                             defaultValue = '',
                             onChangeText = noop,
                             ...props
                           }: InputUncontrolledProps) => {
  const [value, setValue] = useState(defaultValue)

  return (
    <Input
      {...props}
      value={value}
      onChangeText={text => {
        setValue(text)
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
                                                                                    ...restProps
                                                                                  }, ref) {
  const input = (
    <input
      ref={ref}
      id={id}
      {...restProps}
      className={clsx(
        {
          'focus:border-primary focus:ring-primary': !errorText,
          'focus:border-negative focus:ring-negative text-negative': !!errorText,
        },
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
