import {
  useMemo,
  type ReactNode
} from 'react'
import {
  ScrollView,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  ChatConversationListFooterStyle,
  ChatConversationListHeaderStyle,
  ChatConversationListStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type ChatConversationListProps = Omit<ViewProps, 'children' | 'style'> & {
  header?: ReactNode,
  footer?: ReactNode,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  listStyle?: StyleOverwrite<Record<string, never>, ChatConversationListStyle>,
  headerStyle?: StyleOverwrite<Record<string, never>, ChatConversationListHeaderStyle>,
  contentStyle?: StyleProp<ViewStyle>,
  footerStyle?: StyleOverwrite<Record<string, never>, ChatConversationListFooterStyle>,
}

export const ChatConversationList = ({
  header,
  footer,
  children,
  style,
  listStyle,
  headerStyle,
  contentStyle,
  footerStyle,
  ...props
}: ChatConversationListProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({}), [])

  const resolvedListStyle = useMemo(
    () => theme.components.chat.conversationList.container(state, listStyle),
    [theme, state, listStyle]
  )
  const resolvedHeaderStyle = useMemo(
    () => theme.components.chat.conversationList.header(state, headerStyle),
    [theme, state, headerStyle]
  )
  const resolvedFooterStyle = useMemo(
    () => theme.components.chat.conversationList.footer(state, footerStyle),
    [theme, state, footerStyle]
  )

  return (
    <View {...props} style={[resolvedListStyle, style]}>
      {header != null && (
        <View style={resolvedHeaderStyle}>{header}</View>
      )}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={contentStyle}>
        {children}
      </ScrollView>
      {footer != null && (
        <View style={resolvedFooterStyle}>{footer}</View>
      )}
    </View>
  )
}
