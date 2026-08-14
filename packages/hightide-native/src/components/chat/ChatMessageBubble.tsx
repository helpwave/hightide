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
  ChatMessageBubbleBodyStyle,
  ChatMessageBubbleBodyTextStyle,
  ChatMessageBubbleContainerStyle,
  ChatMessageBubbleMetaDataContainerStyle,
  ChatMessageBubbleMetaDataStatusContainerStyle,
  ChatMessageBubbleMetaDataTextStyle,
  ChatMessageBubbleState,
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
  bodyStyle?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleBodyStyle>,
  bodyTextStyle?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleBodyTextStyle>,
  metaDataContainerStyle?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleMetaDataContainerStyle>,
  metaDataStatusContainerStyle?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleMetaDataStatusContainerStyle>,
  metaDataTextStyle?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleMetaDataTextStyle>,
}

export const ChatMessageBubble = ({
  direction = 'incoming',
  timestamp,
  readReceipt,
  children,
  style,
  containerStyle,
  bodyStyle,
  bodyTextStyle,
  metaDataContainerStyle,
  metaDataStatusContainerStyle,
  metaDataTextStyle,
  ...props
}: ChatMessageBubbleProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({ direction }), [direction])
  const hasMetaData = timestamp != null || readReceipt != null

  const resolvedContainerStyle = useMemo(
    () => theme.components.chat.messageBubble.container(state, containerStyle),
    [theme, state, containerStyle]
  )
  const resolvedBodyStyle = useMemo(
    () => theme.components.chat.messageBubble.body(state, bodyStyle),
    [theme, state, bodyStyle]
  )
  const resolvedBodyTextStyle = useMemo(
    () => theme.components.chat.messageBubble.bodyText(state, bodyTextStyle),
    [theme, state, bodyTextStyle]
  )
  const resolvedMetaDataContainerStyle = useMemo(
    () => theme.components.chat.messageBubble.metaDataContainer(state, metaDataContainerStyle),
    [theme, state, metaDataContainerStyle]
  )
  const resolvedMetaDataStatusContainerStyle = useMemo(
    () => theme.components.chat.messageBubble.metaDataStatusContainer(state, metaDataStatusContainerStyle),
    [theme, state, metaDataStatusContainerStyle]
  )
  const resolvedMetaDataTextStyle = useMemo(
    () => theme.components.chat.messageBubble.metaDataText(state, metaDataTextStyle),
    [theme, state, metaDataTextStyle]
  )
  const resolvedMetaDataIcon = useMemo(
    () => theme.components.chat.messageBubble.metaDataIcon(state),
    [theme, state]
  )

  return (
    <View {...props} style={[resolvedContainerStyle, style]}>
      <View style={resolvedBodyStyle}>
        {typeof children === 'string' || typeof children === 'number' ? (
          <ThemedText style={resolvedBodyTextStyle}>{children}</ThemedText>
        ) : (
          children
        )}
      </View>
      {hasMetaData && (
        <View style={resolvedMetaDataContainerStyle}>
          {readReceipt != null && (
            <View style={resolvedMetaDataStatusContainerStyle}>
              <ThemedIcon
                icon={HightideIconRegistry.CheckCheck}
                size={resolvedMetaDataIcon.size}
                strokeWidth={resolvedMetaDataIcon.strokeWidth}
                color={resolvedMetaDataIcon.color}
              />
              {typeof readReceipt === 'string' || typeof readReceipt === 'number' ? (
                <ThemedText style={resolvedMetaDataTextStyle}>{readReceipt}</ThemedText>
              ) : (
                readReceipt
              )}
            </View>
          )}
          {timestamp != null && (
            typeof timestamp === 'string' || typeof timestamp === 'number' ? (
              <ThemedText style={resolvedMetaDataTextStyle}>{timestamp}</ThemedText>
            ) : (
              timestamp
            )
          )}
        </View>
      )}
    </View>
  )
}
