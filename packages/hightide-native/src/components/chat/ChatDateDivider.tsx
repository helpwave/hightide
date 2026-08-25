import {
  useMemo,
  type ReactNode
} from 'react'
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import { ThemedText } from '../visualization-and-display/ThemedText'
import type {
  ChatDateDividerStyle,
  ChatDateDividerTextStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type ChatDateDividerProps = Omit<ViewProps, 'children' | 'style'> & {
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  dividerStyle?: StyleOverwrite<Record<string, never>, ChatDateDividerStyle>,
  textStyle?: StyleOverwrite<Record<string, never>, ChatDateDividerTextStyle>,
}

export const ChatDateDivider = ({
  children,
  style,
  dividerStyle,
  textStyle,
  ...props
}: ChatDateDividerProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({}), [])

  const resolvedDividerStyle = useMemoizedTheme(theme.components.chat.dateDivider.container, state, dividerStyle)
  const resolvedTextStyle = useMemoizedTheme(theme.components.chat.dateDivider.text, state, textStyle)

  return (
    <View {...props} style={[resolvedDividerStyle, style]}>
      {typeof children === 'string' || typeof children === 'number' ? (
        <ThemedText style={resolvedTextStyle}>{children}</ThemedText>
      ) : (
        children
      )}
    </View>
  )
}
