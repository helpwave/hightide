import type { ReactNode } from 'react'
import { useChangingNumber } from '@/src/hooks/useChangingNumber'
import type { Curve } from '@/src/utils/curve'
import { CurveBuilderUtil } from '@/src/utils/curve'

export type ChangingNumberProps = {
  start: number,
  end: number,
  animationTime?: number,
  curve?: Curve,
  resetRateAfterUpdate?: boolean,
  formatValue?: (value: number) => ReactNode,
}

/**
 * Displays a number animating from start to end along a curve over animationTime
 */
export function ChangingNumber({
  start,
  end,
  animationTime = 1000,
  curve = CurveBuilderUtil.easeInEaseOut,
  resetRateAfterUpdate = false,
  formatValue = Math.round,
}: ChangingNumberProps): ReactNode {
  const value = useChangingNumber({
    start,
    end,
    animationTime,
    curve,
    resetRateAfterUpdate,
  })

  return formatValue(value)
}
