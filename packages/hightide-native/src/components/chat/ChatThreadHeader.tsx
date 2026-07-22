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

import { useTheme } from '@/src/global-contexts/theme/ThemeContext'
import type {
  ChatThreadHeaderStyle,
  ChatThreadHeaderSubtitleStyle,
  ChatThreadHeaderTitleStyle
} from '@/src/theme/types/components/chat'
import type { StyleOverwrite } from '@/src/theme/types/resolver'

export type ChatThreadHeaderProps = Omit<ViewProps, 'style'> & {
  avatar?: ReactNode,
  title: ReactNode,
  subtitle?: ReactNode,
  leftActions?: ReactNode,
  rightActions?: ReactNode,
  style?: StyleProp<ViewStyle>,
  headerStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderStyle>,
  titleStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderTitleStyle>,
  subtitleStyle?: StyleOverwrite<Record<string, never>, ChatThreadHeaderSubtitleStyle>,
}

export const ChatThreadHeader = ({
  avatar,
  title,
  subtitle,
  leftActions,
  rightActions,
  style,
  headerStyle,
  titleStyle,
  subtitleStyle,
  ...props
}: ChatThreadHeaderProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({}), [])

  const resolvedHeaderStyle = useMemo(
    () => theme.components.chat.threadHeader.container(state, headerStyle),
    [theme, state, headerStyle]
  )
  const resolvedTitleStyle = useMemo(
    () => theme.components.chat.threadHeader.title(state, titleStyle),
    [theme, state, titleStyle]
  )
  const resolvedSubtitleStyle = useMemo(
    () => theme.components.chat.threadHeader.subtitle(state, subtitleStyle),
    [theme, state, subtitleStyle]
  )

  return (
    <View {...props} style={[resolvedHeaderStyle, style]}>
      {leftActions != null && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
          {leftActions}
        </View>
      )}
      {avatar}
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        {typeof title === 'string' || typeof title === 'number' ? (
          <Text style={resolvedTitleStyle} numberOfLines={1}>{title}</Text>
        ) : (
          title
        )}
        {subtitle != null && (
          typeof subtitle === 'string' || typeof subtitle === 'number' ? (
            <Text style={resolvedSubtitleStyle} numberOfLines={1}>{subtitle}</Text>
          ) : (
            subtitle
          )
        )}
      </View>
      {rightActions != null && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
          {rightActions}
        </View>
      )}
    </View>
  )
}
