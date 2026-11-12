import type { ComponentRef, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { NumberStepperInputContext } from './NumberStepperInputContext'
import { NumberStepperInputField, type NumberStepperInputFieldProps } from './NumberStepperInputField'
import {
  NumberStepperInputLayout as NumberStepperInputLayoutComponent,
  type NumberStepperInputLayoutMode,
  type NumberStepperInputLayoutProps
} from './NumberStepperInputLayout'
import { NumberStepperInputStateManager, type NumberStepperInputStateManagerProps } from './NumberStepperInputStateManager'
import {
  NumberStepperInputDecrement,
  NumberStepperInputIncrement,
  type NumberStepperInputStepButtonProps
} from './NumberStepperInputStepButton'
export type NumberStepperInputLayout = NumberStepperInputLayoutMode

export type NumberStepperInputProps = Omit<NumberStepperInputStateManagerProps, 'children'> & {
  layout?: NumberStepperInputLayout,
  approximateMaxCharacters?: number,
  formatDisplayedValue?: (value: number) => string,
  parseDisplayedValue?: (rawValue: string) => number | undefined,
  layoutRef?: Ref<ComponentRef<typeof NumberStepperInputLayoutComponent>>,
  layoutProps?: NumberStepperInputLayoutProps,
  decrementRef?: Ref<ComponentRef<typeof NumberStepperInputDecrement>>,
  decrementProps?: Omit<NumberStepperInputStepButtonProps, 'direction'>,
  incrementRef?: Ref<ComponentRef<typeof NumberStepperInputIncrement>>,
  incrementProps?: Omit<NumberStepperInputStepButtonProps, 'direction'>,
  fieldRef?: Ref<HTMLInputElement>,
  fieldProps?: NumberStepperInputFieldProps,
}

const NumberStepperInputComponent = ({
  minimum,
  maximum,
  stepSize,
  layout = 'row',
  isLooping,
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
  ...props
}: NumberStepperInputProps) => {
  return (
    <NumberStepperInputStateManager
      {...props}
      minimum={minimum}
      maximum={maximum}
      stepSize={stepSize}
      isLooping={isLooping}
      changeRateCurveProps={changeRateCurveProps}
      onLooped={onLooped}
    >
      <NumberStepperInputLayoutComponent
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
      </NumberStepperInputLayoutComponent>
    </NumberStepperInputStateManager>
  )
}

export const NumberStepperInput = Object.assign(NumberStepperInputComponent, {
  StateManager: NumberStepperInputStateManager,
  Layout: NumberStepperInputLayoutComponent,
  Decrement: NumberStepperInputDecrement,
  Field: NumberStepperInputField,
  Increment: NumberStepperInputIncrement,
  Context: NumberStepperInputContext,
  Provider: NumberStepperInputContext.Provider,
  Consumer: NumberStepperInputContext.Consumer,
})
