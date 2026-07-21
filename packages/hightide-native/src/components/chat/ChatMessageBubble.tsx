import { useMemo, type ReactNode } from 'react'
import { Text, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native'
import { CheckCheck } from 'lucide-react-native'
import { useTheme } from '../../global-contexts/theme'
import type {
  ChatMessageBubbleContainerStyle,
  ChatMessageBubbleContentStyle,
  ChatMessageBubbleState,
  ChatMessageBubbleStyle,
  ChatMessageBubbleTimestampStyle,
  ChatMessageDirection,
  StyleOverwrite
} from '../../theme'

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
    () => theme.components.chat.messageBubbleContainer(state, containerStyle),
    [theme, state, containerStyle]
  )
  const resolvedBubbleStyle = useMemo(
    () => theme.components.chat.messageBubble(state, bubbleStyle),
    [theme, state, bubbleStyle]
  )
  const resolvedContentStyle = useMemo(
    () => theme.components.chat.messageBubbleContent(state, contentStyle),
    [theme, state, contentStyle]
  )
  const resolvedTimestampStyle = useMemo(
    () => theme.components.chat.messageBubbleTimestamp(state, timestampStyle),
    [theme, state, timestampStyle]
  )
  const resolvedReceiptStyle = useMemo(
    () => theme.components.chat.messageBubbleReceipt(staticState),
    [theme, staticState]
  )
  const resolvedReceiptTextStyle = useMemo(
    () => theme.components.chat.messageBubbleReceiptText(staticState),
    [theme, staticState]
  )
  const resolvedReceiptIcon = useMemo(
    () => theme.components.chat.messageBubbleReceiptIcon(staticState),
    [theme, staticState]
  )

  return (
    <View {...props} style={[resolvedContainerStyle, style]}>
      <View style={resolvedBubbleStyle}>
        {typeof children === 'string' || typeof children === 'number' ? (
          <Text style={resolvedContentStyle}>{children}</Text>
        ) : (
          children
        )}
        {timestamp != null && (
          typeof timestamp === 'string' || typeof timestamp === 'number' ? (
            <Text style={resolvedTimestampStyle}>{timestamp}</Text>
          ) : (
            timestamp
          )
        )}
      </View>
      {readReceipt != null && (
        <View style={resolvedReceiptStyle}>
          <CheckCheck size={14} color={resolvedReceiptIcon.color} />
          {typeof readReceipt === 'string' || typeof readReceipt === 'number' ? (
            <Text style={resolvedReceiptTextStyle}>{readReceipt}</Text>
          ) : (
            readReceipt
          )}
        </View>
      )}
    </View>
  )
}
