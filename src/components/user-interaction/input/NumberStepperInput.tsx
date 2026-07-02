import type { InputHTMLAttributes } from 'react'
import { forwardRef, useCallback, useRef } from 'react'
import clsx from 'clsx'
import { Minus, Plus } from 'lucide-react'
import { IconButton } from '@/src/components/user-interaction/IconButton'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import type { FormFieldInteractionStates } from '../../form/FieldLayout'
import type { FormFieldDataHandling } from '../../form/FormField'
import { PropsUtil } from '@/src/utils/propsUtil'
import { useControlledState } from '@/src/hooks/useControlledState'
import { useStepperHold } from '@/src/hooks/useStepperHold'
import { NumberInput } from './NumberInput'
import type { StepperChangeRate, StepperLoopEvent } from './stepperNumberInputUtils'
import {
  applyStepperValueWithLoopEvent,
  commitNumberInputValue,
  defaultStepperChangeRate
} from './stepperNumberInputUtils'

export type { StepperLoopEvent }

export type NumberStepperInputLayout = 'row' | 'col'

export type NumberStepperInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'type' | 'min' | 'max' | 'step'>
  & Partial<FormFieldInteractionStates>
  & Partial<FormFieldDataHandling<number>>
  & {
    initialValue?: number,
    minimum?: number,
    maximum?: number,
    step?: number,
    layout?: NumberStepperInputLayout,
    looping?: boolean,
    approximateMaxCharacters?: number,
    changeRate?: StepperChangeRate,
    formatDisplayedValue?: (value: number) => string,
    parseDisplayedValue?: (rawValue: string) => number | undefined,
    onLooped?: (event: StepperLoopEvent) => void,
    plusButtonClassName?: string,
    minusButtonClassName?: string,
  }

/**
 * A number input with increment and decrement buttons
 *
 * Its state is managed by the parent
 */
export const NumberStepperInput = forwardRef<HTMLInputElement, NumberStepperInputProps>(function NumberStepperInput({
  value: controlledValue,
  initialValue = 0,
  onValueChange,
  onEditComplete,
  minimum,
  maximum,
  step = 1,
  layout = 'row',
  looping = false,
  approximateMaxCharacters = 6,
  changeRate = defaultStepperChangeRate,
  formatDisplayedValue,
  parseDisplayedValue,
  onLooped,
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
  plusButtonClassName,
  minusButtonClassName,
  className,
  ...props
}, forwardedRef) {
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue,
  })
  const valueRef = useRef(value)
  valueRef.current = value
  const translation = useHightideTranslation()

  const commitValue = useCallback((nextValue: number) => {
    const resolved = commitNumberInputValue(nextValue, minimum, maximum, looping)
    setValue(resolved)
    onEditComplete?.(resolved)
    return resolved
  }, [looping, maximum, minimum, onEditComplete, setValue])

  const applyStep = useCallback((delta: number) => {
    const { value: nextValue, loopEvent } = applyStepperValueWithLoopEvent(
      value,
      step * delta,
      minimum,
      maximum,
      looping
    )
    commitValue(nextValue)
    if (loopEvent) {
      onLooped?.(loopEvent)
    }
  }, [commitValue, looping, maximum, minimum, onLooped, step, value])

  const { startHold, stopHold } = useStepperHold({
    disabled: disabled || readOnly,
    minimum,
    maximum,
    looping,
    displayedValue: value,
    step,
    changeRate,
    onValueChange: setValue,
    onLooped,
  })

  const finishHold = useCallback(() => {
    stopHold()
    commitValue(valueRef.current)
  }, [commitValue, stopHold])

  const plusButton = (
    <IconButton
      type="button"
      size="sm"
      color="neutral"
      coloringStyle="tonal"
      disabled={disabled || readOnly}
      tooltip={translation('increaseValue')}
      tooltipProps={{ alignment: layout === 'row' ? 'bottom' : 'top', options: { avoidOverlap: false } }}
      className={clsx('number-stepper-input-button', plusButtonClassName)}
      onPointerDown={() => {startHold(1)}}
      onPointerUp={finishHold}
      onPointerLeave={finishHold}
      onPointerCancel={finishHold}
    >
      <Plus aria-hidden={true} />
    </IconButton>
  )

  const minusButton = (
    <IconButton
      type="button"
      size="sm"
      color="neutral"
      coloringStyle="tonal"
      disabled={disabled || readOnly}
      tooltip={translation('decreaseValue')}
      tooltipProps={{ alignment: 'bottom', options: { avoidOverlap: false } }}
      className={clsx('number-stepper-input-button', minusButtonClassName)}
      onPointerDown={() => {
        startHold(-1)
      }}
      onPointerUp={finishHold}
      onPointerLeave={finishHold}
      onPointerCancel={finishHold}
    >
      <Minus aria-hidden={true} />
    </IconButton>
  )

  return (
    <div
      className={clsx('number-stepper-input', className)}
      data-layout={layout}
      data-disabled={PropsUtil.dataAttributes.bool(disabled)}
      data-readonly={PropsUtil.dataAttributes.bool(readOnly)}
    >
      {layout === 'col' ? plusButton : minusButton}
      <NumberInput
        {...props}
        ref={forwardedRef}
        value={value}
        onValueChange={setValue}
        onEditComplete={onEditComplete}
        minimum={minimum}
        maximum={maximum}
        looping={looping}
        approximateMaxCharacters={approximateMaxCharacters}
        formatDisplayedValue={formatDisplayedValue}
        parseDisplayedValue={parseDisplayedValue}
        invalid={invalid}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        data-name="number-stepper-input-field"
        onKeyDown={(event) => {
          props.onKeyDown?.(event)
          if (event.key === 'ArrowUp') {
            event.preventDefault()
            applyStep(1)
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            applyStep(-1)
          }
        }}
      />
      {layout === 'col' ? minusButton : plusButton}
    </div>
  )
})
