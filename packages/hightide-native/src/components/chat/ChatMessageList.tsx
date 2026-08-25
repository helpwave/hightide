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

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type { ChatMessageListStyle } from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'

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

  const resolvedListStyle = useMemoizedTheme(theme.components.chat.messageList.container, state, listStyle)

  useEffect(() => {
    if (autoScroll) {
      scrollRef.current?.scrollToEnd({ animated: true })
    }
  }, [autoScroll, children])

  return (
    <ScrollView
      ref={scrollRef}
      style={[resolvedListStyle, style]}
      contentContainerStyle={[{ gap: resolvedListStyle.gap }, contentContainerStyle]}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {children}
    </ScrollView>
  )
}
