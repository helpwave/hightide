import type { ReactNode } from 'react'
import { Text, View, type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from 'react-native'
import { CheckCheck } from 'lucide-react-native'
import { useTheme } from '../../global-contexts/theme'
import type {
  ChatMessageBubbleContainerStyle,
  ChatMessageBubbleContentStyle,
  ChatMessageBubbleStyle,
  ChatMessageBubbleTimestampStyle,
  ChatMessageDirection
} from '../../theme'

export type { ChatMessageDirection }

export type ChatMessageBubbleProps = Omit<ViewProps, 'children' | 'style'> & {
  direction?: ChatMessageDirection,
  timestamp?: ReactNode,
  readReceipt?: ReactNode,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  containerStyle?: StyleProp<ViewStyle> | ((style: ChatMessageBubbleContainerStyle) => StyleProp<ViewStyle>),
  bubbleStyle?: StyleProp<ViewStyle> | ((style: ChatMessageBubbleStyle) => StyleProp<ViewStyle>),
  contentStyle?: StyleProp<TextStyle> | ((style: ChatMessageBubbleContentStyle) => StyleProp<TextStyle>),
  timestampStyle?: StyleProp<TextStyle> | ((style: ChatMessageBubbleTimestampStyle) => StyleProp<TextStyle>),
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
  const state = { direction }
  const resolvedContainer = theme.components.chat.messageBubbleContainer(state)
  const resolvedBubble = theme.components.chat.messageBubble(state)
  const resolvedContent = theme.components.chat.messageBubbleContent(state)
  const resolvedTimestamp = theme.components.chat.messageBubbleTimestamp(state)
  const resolvedReceipt = theme.components.chat.messageBubbleReceipt({})
  const resolvedReceiptText = theme.components.chat.messageBubbleReceiptText({})
  const resolvedReceiptIcon = theme.components.chat.messageBubbleReceiptIcon({})

  const appliedContainer = typeof containerStyle === 'function'
    ? containerStyle(resolvedContainer)
    : [resolvedContainer, containerStyle]
  const appliedBubble = typeof bubbleStyle === 'function'
    ? bubbleStyle(resolvedBubble)
    : [resolvedBubble, bubbleStyle]
  const appliedContent = typeof contentStyle === 'function'
    ? contentStyle(resolvedContent)
    : [resolvedContent, contentStyle]
  const appliedTimestamp = typeof timestampStyle === 'function'
    ? timestampStyle(resolvedTimestamp)
    : [resolvedTimestamp, timestampStyle]

  return (
    <View {...props} style={[appliedContainer, style]}>
      <View style={appliedBubble}>
        {typeof children === 'string' || typeof children === 'number' ? (
          <Text style={appliedContent}>{children}</Text>
        ) : (
          children
        )}
        {timestamp != null && (
          typeof timestamp === 'string' || typeof timestamp === 'number' ? (
            <Text style={appliedTimestamp}>{timestamp}</Text>
          ) : (
            timestamp
          )
        )}
      </View>
      {readReceipt != null && (
        <View style={resolvedReceipt}>
          <CheckCheck size={14} color={resolvedReceiptIcon.color} />
          {typeof readReceipt === 'string' || typeof readReceipt === 'number' ? (
            <Text style={resolvedReceiptText}>{readReceipt}</Text>
          ) : (
            readReceipt
          )}
        </View>
      )}
    </View>
  )
}
