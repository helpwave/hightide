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
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { ThemedText } from '../visualization-and-display/ThemedText'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  ChatMessageBubbleContainerStyle,
  ChatMessageBubbleContentStyle,
  ChatMessageBubbleState,
  ChatMessageBubbleStyle,
  ChatMessageBubbleTimestampStyle,
  ChatMessageDirection
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type { ChatMessageDirection }

export type ChatMessageBubbleProps = Omit<ViewProps, 'children' | 'style'> & {
  direction?: ChatMessageDirection,
  timestamp?: ReactNode,
  readReceipt?: ReactNode,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  containerStyle?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleContainerStyle>,
  bubbleStyle?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleStyle>,
  contentStyle?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleContentStyle>,
  timestampStyle?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleTimestampStyle>,
}

export const ChatMessageBubble = ({
  direction = 'incoming',
  timestamp,
  readReceipt,
  children,
  style,
  containerStyle,
  bubbleStyle,
  contentStyle,
  timestampStyle,
  ...props
}: ChatMessageBubbleProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({ direction }), [direction])
  const staticState = useMemo(() => ({}), [])

  const resolvedContainerStyle = useMemo(
    () => theme.components.chat.messageBubble.container(state, containerStyle),
    [theme, state, containerStyle]
  )
  const resolvedBubbleStyle = useMemo(
    () => theme.components.chat.messageBubble.bubble(state, bubbleStyle),
    [theme, state, bubbleStyle]
  )
  const resolvedContentStyle = useMemo(
    () => theme.components.chat.messageBubble.content(state, contentStyle),
    [theme, state, contentStyle]
  )
  const resolvedTimestampStyle = useMemo(
    () => theme.components.chat.messageBubble.timestamp(state, timestampStyle),
    [theme, state, timestampStyle]
  )
  const resolvedReceiptStyle = useMemo(
    () => theme.components.chat.messageBubble.receipt(staticState),
    [theme, staticState]
  )
  const resolvedReceiptTextStyle = useMemo(
    () => theme.components.chat.messageBubble.receiptText(staticState),
    [theme, staticState]
  )
  const resolvedReceiptIcon = useMemo(
    () => theme.components.chat.messageBubble.receiptIcon(staticState),
    [theme, staticState]
  )

  return (
    <View {...props} style={[resolvedContainerStyle, style]}>
      <View style={resolvedBubbleStyle}>
        {typeof children === 'string' || typeof children === 'number' ? (
          <ThemedText style={resolvedContentStyle}>{children}</ThemedText>
        ) : (
          children
        )}
        {timestamp != null && (
          typeof timestamp === 'string' || typeof timestamp === 'number' ? (
            <ThemedText style={resolvedTimestampStyle}>{timestamp}</ThemedText>
          ) : (
            timestamp
          )
        )}
      </View>
      {readReceipt != null && (
        <View style={resolvedReceiptStyle}>
          <ThemedIcon
            icon={HightideIconRegistry.CheckCheck}
            size={14}
            color={resolvedReceiptIcon.color}
          />
          {typeof readReceipt === 'string' || typeof readReceipt === 'number' ? (
            <ThemedText style={resolvedReceiptTextStyle}>{readReceipt}</ThemedText>
          ) : (
            readReceipt
          )}
        </View>
      )}
    </View>
  )
}
