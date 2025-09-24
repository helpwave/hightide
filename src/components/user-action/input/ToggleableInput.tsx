import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Pencil } from 'lucide-react'
import clsx from 'clsx'
import type { EditCompleteOptions, InputProps } from '@/src/components/user-action/input/Input'
import { Input } from '@/src/components/user-action/input/Input'

type ToggleableInputProps = Omit<InputProps, 'defaultStyle'> & {
  initialState?: 'editing' | 'display',
  editCompleteOptions?: Omit<EditCompleteOptions, 'allowEnterComplete'>,
}

/**
 * A Text input component for inputting text. It changes appearance upon entering the edit mode and switches
 * back to display mode on loss of focus or on enter
 *
 * The State is managed by the parent
 */
export const ToggleableInput = forwardRef<HTMLInputElement, ToggleableInputProps>(function ToggleableInput({
                                                                                                             value,
                                                                                                             initialState = 'display',
                                                                                                             editCompleteOptions,
                                                                                                             ...props
                                                                                                           }, forwardedRef) {
  const [isEditing, setIsEditing] = useState(initialState !== 'display')

  const innerRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(forwardedRef, () => innerRef.current)

  useEffect(() => {
    if (isEditing) {
      innerRef.current?.focus()
    }
  }, [isEditing])

  return (
    <div className={clsx('relative flex-row-2', { 'flex-1': isEditing })}>
      <Input
        {...props}
        ref={innerRef}
        value={value}
        onEditCompleted={(text) => {
          props.onEditCompleted?.(text)
          setIsEditing(false)
        }}
        onFocus={event => {
          props.onFocus?.(event)
          setIsEditing(true)
          event.target.select()
        }}
        editCompleteOptions={{
          ...editCompleteOptions,
          allowEnterComplete: true
        }}
        className={clsx(`w-full ring-0 outline-0 decoration-primary underline-offset-4`, {
          'underline': isEditing,
          'text-transparent': !isEditing,
        })}
        defaultStyle={false}
      />
      {!isEditing && (
        <div className="absolute left-0 flex-row-2 items-center pointer-events-none touch-none w-full overflow-hidden">
          <span className={clsx(' truncate')}>
            {value}
          </span>
          <Pencil className={clsx(`size-force-4`, { 'text-transparent': isEditing })} />
        </div>
      )}
    </div>
  )
})

export const ToggleableInputUncontrolled = ({
                                              value: initialValue,
                                              onChangeText,
                                              ...restProps
                                            }: ToggleableInputProps) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <ToggleableInput
      value={value}
      onChangeText={text => {
        onChangeText?.(text)
        setValue(text)
      }}
      {...restProps}
    />
  )
}
