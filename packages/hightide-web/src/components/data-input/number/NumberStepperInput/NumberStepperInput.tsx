import type { ComponentRef, Ref } from 'react'
import { useCallback } from 'react'
import type { ChangeRateCurveProps, StepperLoopEvent } from '@helpwave/hightide-utils/hooks'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { NumberStepperInputContext } from './NumberStepperInputContext'
import { NumberStepperInputField, type NumberStepperInputFieldProps } from './NumberStepperInputField'
import { NumberStepperHold } from './NumberStepperInputHold'
import { NumberStepperInputLayout, type NumberStepperInputLayoutMode, type NumberStepperInputLayoutProps } from './NumberStepperInputLayout'
import { NumberStepperInputStateManager } from './NumberStepperInputStateManager'
import {
  NumberStepperInputDecrement,
  NumberStepperInputIncrement,
  type NumberStepperInputStepButtonProps
} from './NumberStepperInputStepButton'
import type { NumberStepperInputEvent, NumberStepperInputState } from './NumberStepperInputState'

export type NumberStepperInputLayout = NumberStepperInputLayoutMode

export type NumberStepperInputProps = ControllableInputProps<number, NumberStepperInputEvent> & {
  minimum?: number,
  maximum?: number,
  stepSize?: number,
  layout?: NumberStepperInputLayout,
  isLooping?: boolean,
  approximateMaxCharacters?: number,
  changeRateCurveProps?: ChangeRateCurveProps,
  formatDisplayedValue?: (value: number) => string,
  parseDisplayedValue?: (rawValue: string) => number | undefined,
  onLooped?: (event: StepperLoopEvent) => void,
  layoutRef?: Ref<ComponentRef<typeof NumberStepperInputLayout>>,
  layoutProps?: NumberStepperInputLayoutProps,
  decrementRef?: Ref<ComponentRef<typeof NumberStepperInputDecrement>>,
  decrementProps?: Omit<NumberStepperInputStepButtonProps, 'direction'>,
  incrementRef?: Ref<ComponentRef<typeof NumberStepperInputIncrement>>,
  incrementProps?: Omit<NumberStepperInputStepButtonProps, 'direction'>,
  fieldRef?: Ref<HTMLInputElement>,
  fieldProps?: NumberStepperInputFieldProps,
}

const NumberStepperInputComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  minimum,
  maximum,
  stepSize,
  layout = 'row',
  isLooping = false,
  approximateMaxCharacters,
  changeRateCurveProps,
  formatDisplayedValue,
  parseDisplayedValue,
  onLooped,
  layoutRef,
  layoutProps,
  decrementRef,
  decrementProps,
  incrementRef,
  incrementProps,
  fieldRef,
  fieldProps,
}: NumberStepperInputProps) => {
  const [state, setState] = useControlledState<NumberStepperInputState>({
    defaultValue: { value: initialValue ?? 0 },
  })
  const binding = useStateMachineBinding<NumberStepperInputState, number>({
    state,
    onStateChange: setState,
    onValueChange,
    value,
    inject: useCallback((next: number) => ({ value: next }), []),
    get: useCallback((current: NumberStepperInputState) => current.value, []),
  })

  return (
    <NumberStepperInputStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
    >
      <NumberStepperHold
        minimum={minimum}
        maximum={maximum}
        stepSize={stepSize}
        isLooping={isLooping}
        changeRateCurveProps={changeRateCurveProps}
        onLooped={onLooped}
      >
        <NumberStepperInputLayout
          {...layoutProps}
          ref={ReactUtils.assingRefsBuilder([layoutRef])}
          layout={layout}
        >
          <NumberStepperInputDecrement
            {...decrementProps}
            ref={ReactUtils.assingRefsBuilder([decrementRef])}
            layout={layout}
          />
          <NumberStepperInputField
            {...fieldProps}
            inputRef={ReactUtils.assingRefsBuilder([fieldRef, fieldProps?.inputRef])}
            minimum={minimum}
            maximum={maximum}
            approximateMaxCharacters={approximateMaxCharacters}
            formatDisplayedValue={formatDisplayedValue}
            parseDisplayedValue={parseDisplayedValue}
          />
          <NumberStepperInputIncrement
            {...incrementProps}
            ref={ReactUtils.assingRefsBuilder([incrementRef])}
            layout={layout}
          />
        </NumberStepperInputLayout>
      </NumberStepperHold>
    </NumberStepperInputStateManager>
  )
}

export const NumberStepperInput = Object.assign(NumberStepperInputComponent, {
  StateManager: NumberStepperInputStateManager,
  Layout: NumberStepperInputLayout,
  Decrement: NumberStepperInputDecrement,
  Field: NumberStepperInputField,
  Increment: NumberStepperInputIncrement,
  Context: NumberStepperInputContext,
  Provider: NumberStepperInputContext.Provider,
  Consumer: NumberStepperInputContext.Consumer,
})
