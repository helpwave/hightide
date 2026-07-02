import type { ReactNode } from 'react'
import type { StepperChangeRate } from '@/src/components/user-interaction/input/stepperNumberInputUtils'
import { defaultStepperChangeRate } from '@/src/components/user-interaction/input/stepperNumberInputUtils'
import { useChangingNumber } from '@/src/hooks/useChangingNumber'

export type ChangingNumberProps = {
  start: number,
  end: number,
  changeRate?: StepperChangeRate,
  resetRateAfterUpdate?: boolean,
  formatValue?: (value: number) => ReactNode,
}

/**
 * Displays a number animating from start to end using a stepper change rate
 */
export function ChangingNumber({
  start,
  end,
  changeRate = defaultStepperChangeRate,
  resetRateAfterUpdate = false,
  formatValue = Math.round,
}: ChangingNumberProps): ReactNode {
  const value = useChangingNumber({
    start,
    end,
    changeRate,
    resetRateAfterUpdate,
  })

  return formatValue(value)
}
