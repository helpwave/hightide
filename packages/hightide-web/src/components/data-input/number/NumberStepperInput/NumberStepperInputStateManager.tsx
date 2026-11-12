import { useCallback, useMemo, useRef } from 'react'
import type { DOMInputStateManagerProps } from '../../domInput'
import type { ChangeRateCurveProps, StepperLoopEvent } from '@helpwave/hightide-utils/hooks'
import { useInputStateManager, useStepperHold } from '@helpwave/hightide-utils/hooks'
import type { DirectionNumber } from '@helpwave/hightide-utils/utils'
import {
  NumberStepperInputContext,
  type NumberStepperInputContextValue,
  type NumberStepperInputScrollInputMethod
} from './NumberStepperInputContext'
import {
  numberStepperInputStateTransition,
  type NumberStepperInputEvent,
  type NumberStepperInputState
} from './NumberStepperInputState'

export type NumberStepperInputStateManagerProps = DOMInputStateManagerProps<NumberStepperInputState, NumberStepperInputEvent> & {
  minimum?: number,
  maximum?: number,
  stepSize?: number,
  isLooping?: boolean,
  changeRateCurveProps?: ChangeRateCurveProps,
  onLooped?: (event: StepperLoopEvent) => void,
}

type ActiveInputState = {
  type: NumberStepperInputScrollInputMethod | null,
  direction: DirectionNumber,
}

export function NumberStepperInputStateManager({
  state,
  value,
  initialValue,
  onValueChange,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  minimum,
  maximum,
  stepSize = 1,
  isLooping = false,
  changeRateCurveProps,
  onLooped,
  children,
}: NumberStepperInputStateManagerProps) {
  const machine = useInputStateManager({
    state,
    value,
    initialValue,
    onValueChange,
    initialState: { value: 0 },
    transition: numberStepperInputStateTransition,
    onStateChange,
    onStateEvent,
  })
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
  }), [isDisabled, isInvalid, isReadOnly, isRequired, id])
  const activeInputStateRef = useRef<ActiveInputState>({ type: null, direction: 1 })
  const { startHold, stopHold } = useStepperHold({
    disabled: config.isDisabled || config.isReadOnly,
    minimum,
    maximum,
    isLooping,
    value: machine.state.value,
    stepSize,
    changeRateCurveProps,
    onValueChange: (next) => machine.dispatch({ type: 'change', value: next }),
    onLooped,
  })
  const startScroll = useCallback((inputType: NumberStepperInputScrollInputMethod, direction: DirectionNumber) => {
    const activeInputState = activeInputStateRef.current
    if (activeInputState.type !== null) return
    activeInputState.type = inputType
    activeInputState.direction = direction
    startHold(direction)
  }, [startHold])
  const stopScroll = useCallback((inputType: NumberStepperInputScrollInputMethod, direction: DirectionNumber) => {
    const activeInputState = activeInputStateRef.current
    if (inputType !== activeInputState.type || direction !== activeInputState.direction) return
    activeInputState.type = null
    stopHold()
  }, [stopHold])
  const contextValue = useMemo<NumberStepperInputContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
    startScroll,
    stopScroll,
  }), [config, machine.dispatch, machine.state, startScroll, stopScroll])

  return (
    <NumberStepperInputContext.Provider value={contextValue}>
      {children}
    </NumberStepperInputContext.Provider>
  )
}
