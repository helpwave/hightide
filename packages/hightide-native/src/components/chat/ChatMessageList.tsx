import { useEffect, useRef, type ReactNode } from 'react'
import {
  ScrollView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { useTheme } from '../../global-contexts/theme'
import type { ChatMessageListStyle } from '../../theme'

export type ChatMessageListProps = {
  autoScroll?: boolean,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  listStyle?: StyleProp<ViewStyle> | ((style: ChatMessageListStyle) => StyleProp<ViewStyle>),
  contentContainerStyle?: StyleProp<ViewStyle>,
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void,
}

export const ChatMessageList = ({
  autoScroll = true,
  children,
  style,
  listStyle,
  contentContainerStyle,
  onScroll,
}: ChatMessageListProps) => {
  const { theme } = useTheme()
  const scrollRef = useRef<ScrollView>(null)
  const resolvedList = theme.components.chat.messageList({})

  const appliedList = typeof listStyle === 'function'
    ? listStyle(resolvedList)
    : [resolvedList, listStyle]

  useEffect(() => {
    if (autoScroll) {
      scrollRef.current?.scrollToEnd({ animated: true })
    }
  }, [autoScroll, children])

  return (
    <ScrollView
      ref={scrollRef}
      style={[appliedList, style]}
      contentContainerStyle={[{ gap: resolvedList.gap }, contentContainerStyle]}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {children}
    </ScrollView>
  )
}
