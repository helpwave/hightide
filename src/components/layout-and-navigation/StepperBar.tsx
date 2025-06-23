import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Language } from '@/localization/util'
import type { PropsForTranslation } from '@/localization/useTranslation'
import { useTranslation } from '@/localization/useTranslation'
import { range } from '@/util/array'
import { SolidButton } from '../user-action/Button'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

type StepperBarTranslation = {
  back: string,
  next: string,
  confirm: string,
}

const defaultStepperBarTranslation: Record<Language, StepperBarTranslation> = {
  en: {
    back: 'Back',
    next: 'Next Step',
    confirm: 'Create'
  },
  de: {
    back: 'Zurück',
    next: 'Nächster Schritt',
    confirm: 'Erstellen'
  }
}

export type StepperState = {
  currentStep: number,
  seenSteps: Set<number>,
}

export type StepperBarProps = {
  state?: StepperState,
  numberOfSteps: number,
  disabledSteps: Set<number>,
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
                             overwriteTranslation,
                             state,
                             numberOfSteps,
                             disabledSteps = new Set(),
                             onChange,
                             onFinish,
                             finishText,
                             showDots = true,
                             className = '',
                           }: PropsForTranslation<StepperBarTranslation, StepperBarProps>) => {
  const translation = useTranslation(defaultStepperBarTranslation, overwriteTranslation)
  const dots = range(0, numberOfSteps)
  const { currentStep, seenSteps } = state ?? defaultState

  const update = (newStep: number) => {
    seenSteps.add(newStep)
    onChange({ currentStep: newStep, seenSteps })
  }

  return (
    <div
      className={clsx('row justify-between',className)}
    >
      <div className="row flex-[2] justify-start">
        <SolidButton
          disabled={currentStep === 0 || disabledSteps.has(currentStep)}
          onClick={() => {
            update(currentStep - 1)
          }}
          className="row gap-x-1 items-center justify-center"
        >
          <ChevronLeft size={14}/>
          {translation.back}
        </SolidButton>
      </div>
      <div className="row flex-[5] gap-x-2 justify-center items-center">
        {showDots && dots.map((value, index) => {
          const seen = seenSteps.has(index)
          return (
            <div
              key={index}
              onClick={() => seen && update(index)}
              className={clsx('rounded-full w-4 h-4', {
                  'bg-primary hover:brightness-75': index === currentStep && seen && !disabledSteps.has(currentStep),
                  'bg-primary/40 hover:bg-primary': index !== currentStep && seen && !disabledSteps.has(currentStep),
                  'bg-gray-200 outline-transparent': !seen || disabledSteps.has(currentStep),
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
        <div className="row flex-[2] justify-end">
          <SolidButton
            onClick={() => update(currentStep + 1)}
            className="row gap-x-1 items-center justify-center"
            disabled={disabledSteps.has(currentStep)}
          >
            {translation.next}
            <ChevronRight size={14}/>
          </SolidButton>
        </div>
      )}
      {currentStep === numberOfSteps && (
        <div className="row flex-[2] justify-end">
          <SolidButton
            disabled={disabledSteps.has(currentStep)}
            onClick={onFinish}
            className="row gap-x-1 items-center justify-center"
          >
            <Check size={14}/>
            {finishText ?? translation.confirm}
          </SolidButton>
        </div>
      )}
    </div>
  )
}

export const StepperBarUncontrolled = ({ state, onChange, ...props }: StepperBarProps) => {
  const [usedState, setUsedState] = useState<StepperState>(state ?? defaultState)

  useEffect(() => {
    setUsedState(state ?? defaultState)
  }, [state])

  return (
    <StepperBar
      {...props}
      state={usedState}
      onChange={newState => {
        setUsedState(newState)
        onChange(newState)
      }}
    />
  )
}