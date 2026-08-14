import { useCallback, useState } from 'react'
import type {
  Insets,
  LayoutChangeEvent,
  PressableProps
} from 'react-native'

export const computeMinimumTouchTargetHitSlop = (
  layout: { width: number, height: number },
  touchTargetSize: number,
): Insets => {
  const horizontal = Math.max(0, touchTargetSize - layout.width) / 2
  const vertical = Math.max(0, touchTargetSize - layout.height) / 2

  return {
    top: vertical,
    bottom: vertical,
    left: horizontal,
    right: horizontal,
  }
}

const areInsetsEqual = (a: Insets | undefined, b: Insets): boolean => (
  a !== undefined
  && a.top === b.top
  && a.bottom === b.bottom
  && a.left === b.left
  && a.right === b.right
)

export type UseMinimumTouchTargetHitSlopOptions = {
  touchTargetSize: number,
  hitSlop?: PressableProps['hitSlop'],
  onLayout?: PressableProps['onLayout'],
}

export type UseMinimumTouchTargetHitSlopResult = {
  hitSlop: PressableProps['hitSlop'],
  onLayout: NonNullable<PressableProps['onLayout']>,
}

export const useMinimumTouchTargetHitSlop = ({
  touchTargetSize,
  hitSlop: providedHitSlop,
  onLayout: providedOnLayout,
}: UseMinimumTouchTargetHitSlopOptions): UseMinimumTouchTargetHitSlopResult => {
  const [autoHitSlop, setAutoHitSlop] = useState<Insets | undefined>()

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    providedOnLayout?.(event)

    if (providedHitSlop !== undefined) {
      return
    }

    const { width, height } = event.nativeEvent.layout
    const nextHitSlop = computeMinimumTouchTargetHitSlop({ width, height }, touchTargetSize)

    setAutoHitSlop((prev) => (
      areInsetsEqual(prev, nextHitSlop) ? prev : nextHitSlop
    ))
  }, [providedHitSlop, providedOnLayout, touchTargetSize])

  return {
    hitSlop: providedHitSlop !== undefined ? providedHitSlop : autoHitSlop,
    onLayout,
  }
}
