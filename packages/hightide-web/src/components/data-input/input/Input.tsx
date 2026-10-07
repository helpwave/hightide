import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'
import { forwardRef, useRef } from 'react'
import type { StateMachineBinding, StateMachineDefinition, UseDelayOptionsResolved } from '@helpwave/hightide-utils/hooks'
import { useDelay, useStateMachine, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { useFocusManagement } from '../../../hooks/focus/useFocusManagement'
import { ReactUtils } from '@helpwave/hightide-utils/utils'

import { PropsUtil } from '../../../utils/propsUtil'

export type EditCompleteOptionsResolved = {
  onBlur: boolean,
  afterDelay: boolean,
  allowEnterComplete?: boolean,
} & Omit<UseDelayOptionsResolved, 'disabled'>

export type EditCompleteOptions = Partial<EditCompleteOptionsResolved>

const defaultEditCompleteOptions: EditCompleteOptionsResolved = {
  allowEnterComplete: false,
  onBlur: true,
  afterDelay: false,
  delay: 2500
}

export type InputInterface<In, Out = In> = {
  /**
   * The controlled value of the component.
   * The component is controlled when `value` is defined; when `value` is
   * `undefined`, `initialValue` is used and the component manages its own value.
   */
  value?: In,

  /**
   * The initial value used when the component is uncontrolled.
   */
  initialValue?: In,

  /**
   * Called when the component updates its current value during an editing
   * interaction. The callback may be called even when the value is unchanged;
   * consumers should not assume that the value differs from the previous value.
   *
   * This callback is always triggered before onValueCommit with the most current value, but
   * the onValueCommit might fire significantly later (e.g. when a Multiselect Menu updates the
   * selection, but is closed only 20 seconds later)
   */
  onValueUpdate?: (value: Out) => void,

  /**
   * Called when the component considers the current editing interaction
   * complete. The component defines what constitutes completion; for example,
   * this may occur when editing is committed, an interaction ends, or a
   * component-specific editing lifecycle is completed.
   */
  onValueCommit?: (value: Out) => void,
}

export type InputComponentInterface<In, Out = In> = InputInterface<In, Out> & {
  invalid?: boolean,
  disabled?: boolean,
  readOnly?: boolean,
  required?: boolean,
}

export type InputState = {
  value: string,
}

export type InputEvent =
  | { type: 'change', value: string }
  | { type: 'focus' }
  | { type: 'blur' }
  | { type: 'compositionStart' }
  | { type: 'compositionEnd' }

const inputStateTransition = (state: InputState, event: InputEvent): InputState => {
  switch (event.type) {
  case 'change':
    return { value: event.value }
  case 'focus':
  case 'blur':
  case 'compositionStart':
  case 'compositionEnd':
    return state
  }
}

const definition: StateMachineDefinition<InputState, InputEvent> = ({
  initialState: () => ({ value: '' }),
  transition: inputStateTransition,
})

const valueBinding: StateMachineBinding<InputState, string, InputEvent> = {
  get: state => state.value,
  set: value => ({ type: 'change', value }),
}

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value'>
  & InputComponentInterface<string>
  & {
    editCompleteOptions?: EditCompleteOptions,
    state?: InputState,
    onStateChange?: (state: InputState) => void,
    onStateEvent?: (event: InputEvent) => void,
  }

/**
 * A Component for inputting text or other information
 *
 * Its state is managed must be managed by the parent
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  value: controlledValue,
  initialValue = '',
  invalid = false,
  onValueUpdate,
  onValueCommit: onEditComplete,
  editCompleteOptions,
  state,
  onStateChange,
  onStateEvent,
  ...props
}, forwardedRef) {
  const machine = useStateMachine(definition, {
    state,
    onStateEvent,
    onStateChange,
  })

  const boundValue = useStateMachineBinding({
    state: machine.state,
    dispatch: machine.dispatch,
    binding: valueBinding,
    value: controlledValue,
    defaultValue: initialValue,
    onChange: onValueUpdate,
  })
  const {
    onBlur: allowEditCompleteOnBlur,
    afterDelay,
    delay,
    allowEnterComplete
  } = { ...defaultEditCompleteOptions, ...editCompleteOptions }

  const {
    restartTimer,
    clearTimer
  } = useDelay({ delay, disabled: !afterDelay || props.disabled || props.readOnly })

  const innerRef = useRef<HTMLInputElement>(null)

  const { focusNext } = useFocusManagement()

  return (
    <input
      {...props}
      value={boundValue.value}
      ref={ReactUtils.assingRefsBuilder([innerRef, forwardedRef])}

      onKeyDown={event => {
        props.onKeyDown?.(event)
        if (!allowEnterComplete) {
          return
        }
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          innerRef.current?.blur()
          onEditComplete?.((event.target as HTMLInputElement).value)
          focusNext()
        }
      }}
      onFocus={event => {
        props.onFocus?.(event)
        machine.dispatch({ type: 'focus' })
      }}
      onBlur={event => {
        props.onBlur?.(event)
        machine.dispatch({ type: 'blur' })
        if (allowEditCompleteOnBlur) {
          onEditComplete?.(event.target.value)
          clearTimer()
        }
      }}
      onCompositionStart={event => {
        props.onCompositionStart?.(event)
        machine.dispatch({ type: 'compositionStart' })
      }}
      onCompositionEnd={event => {
        props.onCompositionEnd?.(event)
        machine.dispatch({ type: 'compositionEnd' })
      }}
      onChange={event => {
        props.onChange?.(event)
        const value = event.target.value
        restartTimer(() => {
          innerRef.current?.blur()
          onEditComplete?.(value)
        })
        boundValue.setValue(value)
      }}

      className={clsx('input input-element', props.className)}
      data-value={PropsUtil.dataAttributes.bool(!!boundValue.value)}
      {...PropsUtil.dataAttributes.interactionStates({ ...props, invalid })}

      {...PropsUtil.aria.interactionStates({ ...props, invalid }, props)}/>
  )
})