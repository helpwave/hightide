import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import {
  ScrollView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { useTheme } from '../../global-contexts/theme'
import type { ChatMessageListStyle, StyleOverwrite } from '../../theme'

export type ChatMessageListProps = {
  autoScroll?: boolean,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  listStyle?: StyleOverwrite<Record<string, never>, ChatMessageListStyle>,
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
  const state = useMemo(() => ({}), [])

  const resolvedListStyle = useMemo(
    () => theme.components.chat.messageList(state, listStyle),
    [theme, state, listStyle]
  )
  const listGap = useMemo(
    () => (theme.components.chat.messageList(state) as ViewStyle).gap,
    [theme, state]
  )

  useEffect(() => {
    if (autoScroll) {
      scrollRef.current?.scrollToEnd({ animated: true })
    }
  }, [autoScroll, children])

  return (
    <ScrollView
      ref={scrollRef}
      style={[resolvedListStyle, style]}
      contentContainerStyle={[{ gap: listGap }, contentContainerStyle]}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {children}
    </ScrollView>
  )
}
