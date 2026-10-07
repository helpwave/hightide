import type { ChangeEvent } from 'react'
import { useStateMachine, useStateMachineBinding, type StateMachineBinding, type StateMachineDefinition } from '@helpwave/hightide-utils/hooks'

/* ============================================================
 * 1. DOMAIN MODEL
 * ============================================================
 */

type InputState = {
  value: string,
  focused: boolean,
  dirty: boolean,
  composing: boolean,
}

type InputEvent =
  | {
      type: 'change',
      value: string,
    }
  | {
      type: 'focus',
    }
  | {
      type: 'blur',
    }
  | {
      type: 'compositionStart',
    }
  | {
      type: 'compositionEnd',
    }


/* ============================================================
 * 2. STATE TRANSITION
 * ============================================================
 */

function inputTransition(
  state: InputState,
  event: InputEvent
): InputState {
  switch (event.type) {
  case 'change':
    return {
      ...state,
      value: event.value,
      dirty: true,
    }

  case 'focus':
    return {
      ...state,
      focused: true,
    }

  case 'blur':
    return {
      ...state,
      focused: false,
    }

  case 'compositionStart':
    return {
      ...state,
      composing: true,
    }

  case 'compositionEnd':
    return {
      ...state,
      composing: false,
    }
  }
}


/* ============================================================
 * 6. INPUT DEFINITION
 * ============================================================
 */

const inputDefinition:
  StateMachineDefinition<InputState, InputEvent> = {
    initialState: () => ({
      value: '',
      focused: false,
      dirty: false,
      composing: false,
    }),

    transition: inputTransition,
  }


/*
 * Binding for the domain value.
 *
 * This says:
 *
 *   "The public `value` property corresponds to
 *    InputState.value."
 */
const valueBinding: StateMachineBinding<InputState, string, InputEvent> = {
  get: state => state.value,

  set: value => ({
    type: 'change',
    value,
  }),
}


/* ============================================================
 * 7. PUBLIC INPUT API
 * ============================================================
 */

type InputProps = {
  /*
   * Mode 1 / 2:
   *
   * Domain value control.
   */
  value?: string,
  defaultValue?: string,
  onValueChange?: (value: string) => void,

  /*
   * Mode 3:
   *
   * Complete state-machine control.
   */
  state?: InputState,
  onStateEvent?: (event: InputEvent) => void,

  /*
   * Normal DOM props.
   */
  disabled?: boolean,
  readOnly?: boolean,
  placeholder?: string,
  name?: string,
}


/* ============================================================
 * 8. INPUT COMPONENT
 * ============================================================
 */

export function Input(props: InputProps) {
  const {
    value: controlledValue,
    defaultValue = '',
    onValueChange,

    state: controlledState,
    onStateEvent,

    disabled,
    readOnly,
    placeholder,
    name,
  } = props


  /* ----------------------------------------------------------
   * Complete state machine
   * ----------------------------------------------------------
   *
   * In mode 1/2 this owns the complete internal state.
   *
   * In mode 3 the parent owns it.
   */

  const machine = useStateMachine(
    inputDefinition,
    {
      state: controlledState,
      onStateEvent,
    }
  )


  /* ----------------------------------------------------------
   * Value binding
   * ----------------------------------------------------------
   *
   * In mode 1:
   *
   *   binding is completely internal
   *
   * In mode 2:
   *
   *   value is externally controlled
   *
   * In mode 3:
   *
   *   the complete machine is externally controlled
   */

  const value = useStateMachineBinding({
    state: machine.state,
    dispatch: machine.dispatch,
    binding: valueBinding,

    value: controlledValue,
    defaultValue,
    onChange: onValueChange,
  })


  /* ----------------------------------------------------------
   * DOM → semantic events
   * ---------------------------------------------------------- */

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    value.setValue(event.target.value)
  }

  const handleFocus = () => {
    machine.dispatch({
      type: 'focus',
    })
  }

  const handleBlur = () => {
    machine.dispatch({
      type: 'blur',
    })
  }

  const handleCompositionStart = () => {
    machine.dispatch({
      type: 'compositionStart',
    })
  }

  const handleCompositionEnd = () => {
    machine.dispatch({
      type: 'compositionEnd',
    })
  }


  /* ----------------------------------------------------------
   * Render
   * ---------------------------------------------------------- */

  return (
    <input
      name={name}
      value={value.value}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}

      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}

      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
    />
  )
}