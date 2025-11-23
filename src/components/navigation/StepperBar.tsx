import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { range } from '@/src/utils/array'
import { SolidButton } from '../user-action/Button'
import clsx from 'clsx'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'

export type StepperState = {
  currentStep: number,
  seenSteps: Set<number>,
}

export type StepperBarProps = {
  state?: StepperState,
  numberOfSteps: number,
  disabledSteps?: Set<number>,
  onChange: (state: StepperState) => void,
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
                             state = defaultState,
                             numberOfSteps,
                             disabledSteps = new Set(),
                             onChange,
                             onFinish,
                             finishText,
                             showDots = true,
                             className = '',
                           }: StepperBarProps) => {
  const translation = useHightideTranslation()
  const dots = range(numberOfSteps + 1) // +1 for last finish step
  const { currentStep, seenSteps } = state ?? defaultState

  const update = (newStep: number) => {
    seenSteps.add(newStep)
    onChange({ currentStep: newStep, seenSteps })
  }

  return (
    <div
      className={clsx('flex-row-2 justify-between',className)}
    >
      <div className="flex-row-2 flex-[2] justify-start">
        <SolidButton
          disabled={currentStep === 0 || disabledSteps.has(currentStep)}
          onClick={() => {
            update(currentStep - 1)
          }}
          className="flex-row-1 items-center justify-center"
        >
          <ChevronLeft size={14}/>
          {translation('back')}
        </SolidButton>
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
          <SolidButton
            onClick={() => update(currentStep + 1)}
            className="flex-row-1 items-center justify-center"
            disabled={disabledSteps.has(currentStep)}
          >
            {translation('next')}
            <ChevronRight size={14}/>
          </SolidButton>
        </div>
      )}
      {currentStep === numberOfSteps && (
        <div className="flex-row-2 flex-[2] justify-end">
          <SolidButton
            disabled={disabledSteps.has(currentStep)}
            onClick={onFinish}
            className="flex-row-1 items-center justify-center"
          >
            <Check size={14}/>
            {finishText ?? translation('confirm')}
          </SolidButton>
        </div>
      )}
    </div>
  )
}

export const StepperBarUncontrolled = ({ state, onChange, ...props }: StepperBarProps) => {
  const [usedState, setUsedState] = useOverwritableState<StepperState>(state, onChange)

  return (
    <StepperBar
      {...props}
      state={usedState}
      onChange={setUsedState}
    />
  )
}