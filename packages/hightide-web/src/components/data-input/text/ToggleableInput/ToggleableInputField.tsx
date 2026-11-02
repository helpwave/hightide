import type { ComponentRef, Ref } from 'react'
import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useEditCompletable } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { TextInput, type TextInputElementProps } from '../TextInput'
import { useToggleableInputContext } from './ToggleableInputContext'

export type ToggleableInputEditOptions = {
  isCompletingOnBlur?: boolean,
  isCompletingAfterDelay?: boolean,
  delay?: number,
}

export type ToggleableInputFieldProps = {
  inputRef?: Ref<ComponentRef<typeof TextInput.Input>>,
  inputProps?: TextInputElementProps,
  editOptions?: ToggleableInputEditOptions,
}

export function ToggleableInputField({
  inputRef,
  inputProps,
  editOptions,
}: ToggleableInputFieldProps) {
  const { state, dispatch, config } = useToggleableInputContext()
  const edit = useEditCompletable({
    value: state.value,
    onEditComplete: (text) => dispatch({ type: 'commit', value: text }),
    delay: editOptions?.delay,
    isTimerEnabled: editOptions?.isCompletingAfterDelay ?? false,
  })
  const isBlurCompleteEnabled = editOptions?.isCompletingOnBlur ?? true
  const focusRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.isEditing) {
      focusRef.current?.focus()
    }
  }, [state.isEditing])

  return (
    <TextInput
      value={state.value}
      isInvalid={config.isInvalid}
      isDisabled={config.isDisabled}
      isReadOnly={config.isReadOnly}
      isRequired={config.isRequired}
      id={config.id}
      onValueChange={(text) => {
        dispatch({ type: 'change', value: text })
        if (editOptions?.isCompletingAfterDelay) {
          edit.setTimer()
        }
      }}
      inputRef={ReactUtils.assingRefsBuilder([focusRef, inputRef])}
      inputProps={{
        ...inputProps,
        onKeyDown: (event) => {
          inputProps?.onKeyDown?.(event)
          if (edit.completeOnKey(event)) {
            event.currentTarget.blur()
          }
        },
        onFocus: (event) => {
          inputProps?.onFocus?.(event)
          dispatch({ type: 'startEditing' })
          event.target.select()
        },
        onBlur: (event) => {
          inputProps?.onBlur?.(event)
          if (isBlurCompleteEnabled) {
            edit.completeNow()
          }
        },
        className: clsx('togglable-input', inputProps?.className),
        ...{ 'data-isediting': state.isEditing ? '' : undefined },
      }}
    />
  )
}
