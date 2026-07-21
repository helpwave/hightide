import type { ReactNode } from 'react'
import {
  ScrollView,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'
import { useTheme } from '../../global-contexts/theme'
import type {
  ChatConversationListFooterStyle,
  ChatConversationListHeaderStyle,
  ChatConversationListStyle
} from '../../theme'

export type ChatConversationListProps = Omit<ViewProps, 'children' | 'style'> & {
  header?: ReactNode,
  footer?: ReactNode,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  listStyle?: StyleProp<ViewStyle> | ((style: ChatConversationListStyle) => StyleProp<ViewStyle>),
  headerStyle?: StyleProp<ViewStyle> | ((style: ChatConversationListHeaderStyle) => StyleProp<ViewStyle>),
  contentStyle?: StyleProp<ViewStyle>,
  footerStyle?: StyleProp<ViewStyle> | ((style: ChatConversationListFooterStyle) => StyleProp<ViewStyle>),
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
  const resolvedList = theme.components.chat.conversationList({})
  const resolvedHeader = theme.components.chat.conversationListHeader({})
  const resolvedFooter = theme.components.chat.conversationListFooter({})

  const appliedList = typeof listStyle === 'function'
    ? listStyle(resolvedList)
    : [resolvedList, listStyle]
  const appliedHeader = typeof headerStyle === 'function'
    ? headerStyle(resolvedHeader)
    : [resolvedHeader, headerStyle]
  const appliedFooter = typeof footerStyle === 'function'
    ? footerStyle(resolvedFooter)
    : [resolvedFooter, footerStyle]

  return (
    <View {...props} style={[appliedList, style]}>
      {header != null && (
        <View style={appliedHeader}>{header}</View>
      )}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={contentStyle}>
        {children}
      </ScrollView>
      {footer != null && (
        <View style={appliedFooter}>{footer}</View>
      )}
    </View>
  )
}
