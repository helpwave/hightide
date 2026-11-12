import type { ComponentRef, Ref } from 'react'
import { useMemo } from 'react'
import clsx from 'clsx'
import { useControllableStateStore } from '@helpwave/hightide-utils/hooks'
import { TextInput, type TextInputElementProps, type TextInputEvent } from '../TextInput'
import { useInsideLabelInputContext } from './InsideLabelInputContext'

export type InsideLabelInputFieldProps = {
  inputRef?: Ref<ComponentRef<typeof TextInput.Input>>,
  inputProps?: TextInputElementProps,
}

export function InsideLabelInputField({
  inputRef,
  inputProps,
}: InsideLabelInputFieldProps) {
  const { state, dispatch, config, labelId } = useInsideLabelInputContext()
  const inputState = useMemo(() => ({ value: state.value }), [state.value])
  const input = useControllableStateStore({
    state: inputState,
    onStateChange: (next) => dispatch({ type: 'change', value: next.value }),
  })
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
      state={input.store}
      onStateChange={input.onStateChange}
      onStateEvent={forwardEvent}
      isInvalid={config.isInvalid}
      isDisabled={config.isDisabled}
      isReadOnly={config.isReadOnly}
      isRequired={config.isRequired}
      id={config.id}
    >
      <TextInput.Input
        {...inputProps}
        ref={inputRef}
        id={config.id}
        aria-labelledby={labelId}
        className={clsx('h-14 px-4 pb-2 py-6.5', inputProps?.className)}
      />
    </TextInput.StateManager>
  )
}
