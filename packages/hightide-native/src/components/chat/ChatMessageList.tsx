import {
  useEffect,
  useMemo,
  useRef,
  type ReactNode
} from 'react'
import {
  ScrollView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import { useTheme } from '@/src/global-contexts/theme/ThemeContext'
import type { ChatMessageListStyle } from '@/src/theme/types/components/chat'
import type { StyleOverwrite } from '@/src/theme/types/resolver'

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
    () => theme.components.chat.messageList.container(state, listStyle),
    [theme, state, listStyle]
  )
  const listGap = useMemo(
    () => (theme.components.chat.messageList.container(state) as ViewStyle).gap,
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
