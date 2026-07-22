import {
  useMemo,
  type ReactNode
} from 'react'
import {
  Text,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'
import { CheckCheck } from 'lucide-react-native'

import type { ColoringType } from '@helpwave/hightide-design/helpers'

import { useTheme } from '@/src/global-contexts/theme/ThemeContext'
import type {
  ChatSystemLineState,
  ChatSystemLineStyle,
  ChatSystemLineTextStyle
} from '@/src/theme/types/components/chat'
import type { StyleOverwrite } from '@/src/theme/types/resolver'

export type ChatSystemLineProps = Omit<ViewProps, 'children' | 'style'> & {
  icon?: ReactNode,
  color?: ColoringType,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  lineStyle?: StyleOverwrite<ChatSystemLineState, ChatSystemLineStyle>,
  textStyle?: StyleOverwrite<ChatSystemLineState, ChatSystemLineTextStyle>,
}

export const ChatSystemLine = ({
  icon,
  color = 'primary',
  children,
  style,
  lineStyle,
  textStyle,
  ...props
}: ChatSystemLineProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({ color }), [color])

  const resolvedLineStyle = useMemo(
    () => theme.components.chat.systemLine.container(state, lineStyle),
    [theme, state, lineStyle]
  )
  const resolvedTextStyle = useMemo(
    () => theme.components.chat.systemLine.text(state, textStyle),
    [theme, state, textStyle]
  )
  const resolvedIcon = useMemo(
    () => theme.components.chat.systemLine.icon(state),
    [theme, state]
  )

  return (
    <View {...props} style={[resolvedLineStyle, style]}>
      {icon ?? <CheckCheck size={14} color={resolvedIcon.color} />}
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text style={resolvedTextStyle}>{children}</Text>
      ) : (
        children
      )}
    </View>
  )
}
