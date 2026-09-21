import type { ReactNode } from 'react'
import { useChangingNumber } from '@helpwave/hightide-utils/hooks'
import type { Curve } from '@helpwave/hightide-utils/utils'
import { CurveBuilderUtil } from '@helpwave/hightide-utils/utils'

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
