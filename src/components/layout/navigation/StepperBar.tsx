import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { range } from '@/src/utils/array'
import { Button } from '@/src/components/user-interaction/Button'
import clsx from 'clsx'
import { useControlledState } from '@/src/hooks/useControlledState'

export type StepperState = {
  currentStep: number,
  seenSteps: Set<number>,
}

export type StepperBarProps = {
  state?: StepperState,
  initialState?: StepperState,
  onStateChange: (state: StepperState) => void,
  numberOfSteps: number,
  disabledSteps?: Set<number>,
  onFinish: () => void,
  finishText?: string,
  showDots?: boolean,
  className?: string,
}

const defaultState: StepperState = {
  currentStep: 0,
  seenSteps: new Set([0])
}

/**
 * A Component for stepping
 */
export const StepperBar = ({
  state: controlledState,
  initialState = defaultState,
  numberOfSteps,
  disabledSteps = new Set(),
  onStateChange,
  onFinish,
  finishText,
  showDots = true,
  className = '',
}: StepperBarProps) => {
  const translation = useHightideTranslation()
  const dots = range(numberOfSteps + 1) // +1 for last finish step
  const [state, setState] = useControlledState({
    value: controlledState,
    onValueChange: onStateChange,
    defaultValue: initialState,
  })
  const { currentStep, seenSteps } = state

  const update = (newStep: number) => {
    seenSteps.add(newStep)
    setState({ currentStep: newStep, seenSteps })
  }

  return (
    <div
      className={clsx('flex-row-2 justify-between',className)}
    >
      <div className="flex-row-2 flex-[2] justify-start">
        <Button
          disabled={currentStep === 0 || disabledSteps.has(currentStep)}
          onClick={() => {
            update(currentStep - 1)
          }}
          className="flex-row-1 items-center justify-center"
        >
          <ChevronLeft size={14}/>
          {translation('back')}
        </Button>
      </div>
      <div className="flex-row-2 flex-[5] justify-center items-center">
        {showDots && dots.map((value, index) => {
          const seen = seenSteps.has(index)
          return (
            <div
              key={index}
              onClick={() => seen && update(index)}
              className={clsx('rounded-full w-4 h-4', {
                'bg-stepperbar-dot-active hover:brightness-75': index === currentStep && seen && !disabledSteps.has(currentStep),
                'bg-stepperbar-dot-normal hover:bg-stepperbar-dot-active': index !== currentStep && seen && !disabledSteps.has(currentStep),
                'bg-stepperbar-dot-disabled': !seen || disabledSteps.has(currentStep),
              },
              {
                'cursor-pointer': seen,
                'cursor-not-allowed': !seen || disabledSteps.has(currentStep),
              })}
            />
          )
        })}
      </div>
      {currentStep !== numberOfSteps && (
        <div className="flex-row-2 flex-[2] justify-end">
          <Button
            onClick={() => update(currentStep + 1)}
            className="flex-row-1 items-center justify-center"
            disabled={disabledSteps.has(currentStep)}
          >
            {translation('next')}
            <ChevronRight size={14}/>
          </Button>
        </div>
      )}
      {currentStep === numberOfSteps && (
        <div className="flex-row-2 flex-[2] justify-end">
          <Button
            disabled={disabledSteps.has(currentStep)}
            onClick={onFinish}
            className="flex-row-1 items-center justify-center"
          >
            <Check size={14}/>
            {finishText ?? translation('confirm')}
          </Button>
        </div>
      )}
    </div>
  )
}
