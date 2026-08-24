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

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { ThemedText } from '../visualization-and-display/ThemedText'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type {
  ChatSystemLineState,
  ChatSystemLineStyle,
  ChatSystemLineTextStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type ChatSystemLineProps = Omit<ViewProps, 'children' | 'style'> & {
  icon?: ReactNode,
  color?: ColorPairToken,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  lineStyle?: StyleOverwrite<ChatSystemLineState, ChatSystemLineStyle>,
  textStyle?: StyleOverwrite<ChatSystemLineState, ChatSystemLineTextStyle>,
}

export const ChatSystemLine = ({
  icon,
  color,
  children,
  style,
  lineStyle,
  textStyle,
  ...props
}: ChatSystemLineProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({ color }), [color])

  const resolvedLineStyle = useMemoizedTheme(theme.components.chat.systemLine.container, state, lineStyle)
  const resolvedTextStyle = useMemoizedTheme(theme.components.chat.systemLine.text, state, textStyle)
  const resolvedIcon = useMemoizedTheme(theme.components.chat.systemLine.icon, state)

  return (
    <View {...props} style={[resolvedLineStyle, style]}>
      {icon ?? (
        <ThemedIcon
          icon={HightideIconRegistry.CheckCheck}
          size={14}
          color={resolvedIcon.color}
        />
      )}
      {typeof children === 'string' || typeof children === 'number' ? (
        <ThemedText style={resolvedTextStyle}>{children}</ThemedText>
      ) : (
        children
      )}
    </View>
  )
}
