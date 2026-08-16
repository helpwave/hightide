import type { Insets, PressableProps, ViewStyle } from 'react-native'

export const resolveHitSlopInsets = (hitSlop: PressableProps['hitSlop']): Insets => {
  if (hitSlop === undefined || hitSlop === null) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }
  }

  if (typeof hitSlop === 'number') {
    return {
      top: hitSlop,
      right: hitSlop,
      bottom: hitSlop,
      left: hitSlop,
    }
  }

  return {
    top: hitSlop.top ?? 0,
    right: hitSlop.right ?? 0,
    bottom: hitSlop.bottom ?? 0,
    left: hitSlop.left ?? 0,
  }
}

export const createHitBoxOverlayStyle = (
  hitSlop: PressableProps['hitSlop'],
  color: string
): ViewStyle => {
  const insets = resolveHitSlopInsets(hitSlop)

  return {
    position: 'absolute',
    top: -(insets.top ?? 0),
    right: -(insets.right ?? 0),
    bottom: -(insets.bottom ?? 0),
    left: -(insets.left ?? 0),
    backgroundColor: color,
  }
}
