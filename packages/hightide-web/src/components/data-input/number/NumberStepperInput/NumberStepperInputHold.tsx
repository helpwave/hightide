import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useRef } from 'react'
import type { ChangeRateCurveProps, StepperLoopEvent } from '@helpwave/hightide-utils/hooks'
import { useStepperHold } from '@helpwave/hightide-utils/hooks'
import type { DirectionNumber } from '@helpwave/hightide-utils/utils'
import { useNumberStepperInputContext } from './NumberStepperInputContext'

type InputType = 'button' | 'keyboard'

type ActiveInputState = {
  type: InputType | null,
  direction: DirectionNumber,
}

type NumberStepperHoldValue = {
  start: (inputType: InputType, direction: DirectionNumber) => void,
  stop: (inputType: InputType, direction: DirectionNumber) => void,
}

const NumberStepperHoldContext = createContext<NumberStepperHoldValue | null>(null)

export function useNumberStepperHold(): NumberStepperHoldValue {
  const context = useContext(NumberStepperHoldContext)
  if (!context) throw new Error('useNumberStepperHold must be used inside a NumberStepperInput.Layout')
  return context
}

export type NumberStepperHoldProps = {
  minimum?: number,
  maximum?: number,
  stepSize?: number,
  isLooping?: boolean,
  changeRateCurveProps?: ChangeRateCurveProps,
  onLooped?: (event: StepperLoopEvent) => void,
  children?: ReactNode,
}

export function NumberStepperHold({
  minimum,
  maximum,
  stepSize = 1,
  isLooping = false,
  changeRateCurveProps,
  onLooped,
  children,
}: NumberStepperHoldProps) {
  const { state, dispatch, config } = useNumberStepperInputContext()
  const activeInputStateRef = useRef<ActiveInputState>({ type: null, direction: 1 })
  const { startHold, stopHold } = useStepperHold({
    disabled: config.isDisabled || config.isReadOnly,
    minimum,
    maximum,
    isLooping,
    value: state.value,
    stepSize,
    changeRateCurveProps,
    onValueChange: (next) => dispatch({ type: 'change', value: next }),
    onLooped,
  })
  const start = useCallback((inputType: InputType, direction: DirectionNumber) => {
    const activeInputState = activeInputStateRef.current
    if (activeInputState.type !== null) return
    activeInputState.type = inputType
    activeInputState.direction = direction
    startHold(direction)
  }, [startHold])
  const stop = useCallback((inputType: InputType, direction: DirectionNumber) => {
    const activeInputState = activeInputStateRef.current
    if (inputType !== activeInputState.type || direction !== activeInputState.direction) return
    activeInputState.type = null
    stopHold()
  }, [stopHold])

  return (
    <NumberStepperHoldContext.Provider value={{ start, stop }}>
      {children}
    </NumberStepperHoldContext.Provider>
  )
}
