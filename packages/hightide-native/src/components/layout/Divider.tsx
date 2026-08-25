import {
  forwardRef,
  useMemo
} from 'react'
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'

import type { ColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type { DividerDirection } from '@helpwave/hightide-design/component-token-resolvers'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type {
  DividerState,
  DividerStyle
} from '../../theme/types/components/divider'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type DividerProps = Omit<ViewProps, 'style'> & {
  direction?: DividerDirection,
  color?: ColorToken,
  width?: number,
  margin?: number,
  style?: StyleProp<ViewStyle>,
  dividerStyle?: StyleOverwrite<DividerState, DividerStyle>,
}

export const Divider = forwardRef<View, DividerProps>(function Divider({
  direction = 'horizontal',
  color,
  width,
  margin,
  style,
  dividerStyle,
  ...props
}, ref) {
  const { theme } = useTheme()
  const state = useMemo((): DividerState => ({
    direction,
    color,
    width,
    margin,
  }), [direction, color, width, margin])

  const resolvedDividerStyle = useMemoizedTheme(theme.components.divider.container, state, dividerStyle)

  return (
    <View
      {...props}
      ref={ref}
      style={[resolvedDividerStyle, style]}
    />
  )
})
