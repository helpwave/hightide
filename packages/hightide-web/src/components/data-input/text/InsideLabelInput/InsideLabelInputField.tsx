import type { ComponentRef, Ref } from 'react'
import clsx from 'clsx'
import { TextInput, type TextInputElementProps, type TextInputEvent } from '../TextInput'
import { useInsideLabelInputContext } from './InsideLabelInputContext'

export type InsideLabelInputFieldProps = {
  id: string,
  labelId: string,
  inputRef?: Ref<ComponentRef<typeof TextInput.Input>>,
  inputProps?: TextInputElementProps,
}

export function InsideLabelInputField({
  id,
  labelId,
  inputRef,
  inputProps,
}: InsideLabelInputFieldProps) {
  const { state, dispatch, config } = useInsideLabelInputContext()
  const forwardEvent = (event: TextInputEvent) => {
    if (event.type === 'focus') {
      dispatch({ type: 'focus' })
    }
    if (event.type === 'blur') {
      dispatch({ type: 'blur' })
    }
  }

  return (
    <TextInput.StateManager
      state={{ value: state.value }}
      onStateChange={(next) => dispatch({ type: 'change', value: next.value })}
      onStateEvent={forwardEvent}
      isInvalid={config.isInvalid}
      isDisabled={config.isDisabled}
      isReadOnly={config.isReadOnly}
      isRequired={config.isRequired}
    >
      <TextInput.Input
        {...inputProps}
        ref={inputRef}
        id={id}
        aria-labelledby={labelId}
        className={clsx('h-14 px-4 pb-2 py-6.5', inputProps?.className)}
      />
    </TextInput.StateManager>
  )
}
