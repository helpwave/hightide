import type { ReactNode } from 'react'
import { useId } from 'react'
import { forwardRef, useState } from 'react'
import clsx from 'clsx'
import type { TextInputElementProps, TextInputProps } from './TextInput'
import { TextInput } from './TextInput'
import { useControlledState } from '@helpwave/hightide-utils/hooks'

type InsideLabelInputProps = Omit<TextInputProps, 'inputProps'>
  & Omit<TextInputElementProps, 'aria-label' | 'aria-labelledby' | 'placeholder'>
  & {
    label: ReactNode,
  }

/**
 * Text input component with a label inside the input that moves up when editing
 *
 * The State is managed by the parent
 */
export const InsideLabelInput = forwardRef<HTMLInputElement, InsideLabelInputProps>(function InsideLabelInput({
  id: customId,
  value: controlledValue,
  initialValue,
  initialState,
  onValueChange,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  state,
  onStateChange,
  onStateEvent,
  inputRef,
  label,
  ...elementProps
}, forwardedRef) {
  const [value, setValue] = useControlledState<string>({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })
  const [isFocused, setIsFocused] = useState(false)
  const generatedId = useId()
  const id = customId ?? generatedId

  return (
    <div className={clsx('relative')}>
      <TextInput
        ref={forwardedRef}
        value={value}
        initialState={initialState}
        isInvalid={isInvalid}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        state={state}
        onStateChange={onStateChange}
        onStateEvent={onStateEvent}
        inputRef={inputRef}
        onValueChange={setValue}
        inputProps={{
          ...elementProps,
          id,
          'onFocus': event => {
            elementProps.onFocus?.(event)
            setIsFocused(true)
          },
          'onBlur': event => {
            elementProps.onBlur?.(event)
            setIsFocused(false)
          },
          'aria-labelledby': id + '-label',
          'className': clsx('h-14 px-4 pb-2 py-6.5', elementProps.className),
        }}
      />
      <label
        id={id + '-label'}
        aria-hidden={true}
        data-display={isFocused || !!value ? 'small' : 'full'}
        className={clsx(
          'absolute left-4 ml-0.5 top-2 transition-all delay-25 pointer-events-none touch-none',
          'data-[display=small]:top-2 data-[display=small]:h-force-4.5 data-[display=small]:typography-caption-sm data-[display=small]:overflow-y-hidden',
          'data-[display=full]:top-1/2 data-[display=full]:-translate-y-1/2 data-[display=full]:typography-body-md'
        )}
      >
        {label}
      </label>
    </div>
  )
})
