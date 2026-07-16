import type { InputHTMLAttributes } from 'react'
import { forwardRef, useCallback, useRef } from 'react'
import clsx from 'clsx'
import { Minus, Plus } from 'lucide-react'
import { IconButton } from '@/src/components/user-interaction/IconButton'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import type { FormFieldInteractionStates } from '../../form/FieldLayout'
import type { FormFieldDataHandling } from '../../form/FormField'
import { PropsUtil } from '@/src/utils/propsUtil'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import type { ChangeRateCurveProps, StepperLoopEvent } from '@helpwave/hightide-utils/hooks'
import { useStepperHold } from '@helpwave/hightide-utils/hooks'
import { NumberInput } from './NumberInput'
import type { DirectionNumber } from '@helpwave/hightide-utils/utils'

export type NumberStepperInputLayout = 'row' | 'col'

type InputType = 'button' | 'keyboard'

type ActiveInputState = {
  type: InputType | null,
  direction: DirectionNumber,
}

export type NumberStepperInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'type' | 'min' | 'max' | 'step'>
  & Partial<FormFieldInteractionStates>
  & Partial<FormFieldDataHandling<number>>
  & {
    initialValue?: number,
    minimum?: number,
    maximum?: number,
    stepSize?: number,
    layout?: NumberStepperInputLayout,
    looping?: boolean,
    approximateMaxCharacters?: number,
    changeRateCurveProps?: ChangeRateCurveProps,
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
  stepSize: step = 1,
  layout = 'row',
  looping = false,
  approximateMaxCharacters = 6,
  changeRateCurveProps,
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

  const activeInputStateRef = useRef<ActiveInputState>({
    type: null,
    direction: 1
  })

  const { startHold, stopHold } = useStepperHold({
    disabled: disabled || readOnly,
    minimum,
    maximum,
    isLooping: looping,
    value,
    stepSize: step,
    changeRateCurveProps,
    onValueChange: setValue,
    onLooped,
  })

  const start = useCallback((inputType: InputType, direction: DirectionNumber) => {
    const activeInputState = activeInputStateRef.current

    if(activeInputState.type !== null) return

    activeInputState.type = inputType
    activeInputState.direction = direction
    startHold(direction)
  }, [startHold])

  const stop = useCallback((inputType: InputType, direction: DirectionNumber) => {
    const activeInputState = activeInputStateRef.current
    if(inputType !== activeInputState.type || direction !== activeInputState.direction) return
    activeInputState.type = null
    stopHold()
  }, [stopHold])

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
      onPointerDown={() => start('button', 1)}
      onPointerUp={() => stop('button', 1)}
      onPointerLeave={() => stop('button', 1)}
      onPointerCancel={() => stop('button', 1)}
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
      onPointerDown={() => start('button', -1)}
      onPointerUp={() => stop('button', -1)}
      onPointerLeave={() => stop('button', -1)}
      onPointerCancel={() => stop('button', -1)}
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
            start('keyboard', 1)
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            start('keyboard', -1)
          }
        }}
        onKeyUp={(event) => {
          props.onKeyDown?.(event)
          if (event.key === 'ArrowUp') {
            event.preventDefault()
            stop('keyboard', 1)
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            stop('keyboard', -1)
          }
        }}
      />
      {layout === 'col' ? minusButton : plusButton}
    </div>
  )
})
