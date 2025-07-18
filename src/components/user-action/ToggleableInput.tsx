import type { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Pencil } from 'lucide-react'
import clsx from 'clsx'
import type { UseDelayOptions } from '../../hooks/useDelay'
import { useDelay } from '../../hooks/useDelay'
import { noop } from '../../util/noop'

type InputProps = {
  /**
   * The value
   */
  value: string,
  /**
   * @default 'text'
   */
  type?: HTMLInputTypeAttribute,
  /**
   * Callback for when the input's value changes
   * This is pretty much required but made optional for the rare cases where it actually isn't need such as when used with disabled
   * That could be enforced through a union type but that seems a bit overkill
   * @default noop
   */
  onChangeText?: (text: string) => void,
  onEditCompleted?: (text: string) => void,
  labelClassName?: string,
  initialState?: 'editing' | 'display',
  size?: number,
  disclaimer?: string,
  saveDelayOptions?: UseDelayOptions,
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'label' | 'type' | 'crossOrigin'>

/**
 * A Text input component for inputting text. It changes appearance upon entering the edit mode and switches
 * back to display mode on loss of focus or on enter
 *
 * The State is managed by the parent
 */
export const ToggleableInput = ({
                                  type = 'text',
                                  value,
                                  onChange = noop,
                                  onChangeText = noop,
                                  onEditCompleted = noop,
                                  labelClassName = '',
                                  initialState = 'display',
                                  size = 16,
                                  disclaimer,
                                  onBlur,
                                  saveDelayOptions,
                                  ...restProps
                                }: InputProps) => {
  const [isEditing, setIsEditing] = useState(initialState !== 'display')
  const { restartTimer, clearTimer } = useDelay(saveDelayOptions)
  const ref = useRef<HTMLInputElement>(null)

  const onEditCompletedWrapper = (text: string) => {
    onEditCompleted(text)
    clearTimer()
  }

  useEffect(() => {
    if (isEditing) {
      ref.current?.focus()
    }
  }, [isEditing])

  return (
    <div>
      <div
        className={clsx('flex-row-2 items-center w-full overflow-hidden', { 'cursor-pointer': !isEditing })}
        onClick={() => !isEditing ? setIsEditing(!isEditing) : undefined}
      >
        <div className={clsx('flex-row-2 overflow-hidden', { 'flex-1': isEditing })}>
          {isEditing ? (
            <input
              ref={ref}
              {...restProps}
              value={value}
              type={type}
              onChange={event => {
                const value = event.target.value
                restartTimer(() => {
                  onEditCompletedWrapper(value)
                })
                onChangeText(value)
                onChange(event)
              }}
              onBlur={(event) => {
                if (onBlur) {
                  onBlur(event)
                }
                onEditCompletedWrapper(value)
                setIsEditing(false)
              }}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  setIsEditing(false)
                  onEditCompletedWrapper(value)
                }
              }}
              className={clsx(`w-full border-none rounded-none ring-0 outline-0 text-inherit bg-inherit shadow-transparent decoration-primary p-0 underline-offset-4`, {
                underline: isEditing
              }, labelClassName)}
              onFocus={event => event.target.select()}
            />
          ) : (
            <span className={clsx('max-w-xs break-words overflow-hidden', labelClassName)}>
              {value}
            </span>
          )}
        </div>
        <Pencil
          className={clsx(`cursor-pointer`, { 'text-transparent': isEditing })}
          size={size}
          style={{ minWidth: `${size}px` }}
        />
      </div>
      {(isEditing && disclaimer) && (
        <label className="text-negative">
          {disclaimer}
        </label>
      )}
    </div>
  )
}

export const ToggleableInputUncontrolled = ({
                                              value: initialValue,
                                              onChangeText = noop,
                                              ...restProps
                                            }: InputProps) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <ToggleableInput
      value={value}
      onChangeText={text => {
        setValue(text)
        onChangeText(text)
      }}
      {...restProps}
    />
  )
}
