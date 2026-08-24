import {
  useMemo,
  type ReactNode
} from 'react'
import {
  View,
  type ViewProps
} from 'react-native'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { ThemedText } from '../visualization-and-display/ThemedText'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import {
  useDateTimeFormat,
  useLocalization
} from '../../global-contexts/localization/forward-exports'
import type {
  ChatMessageStatus
} from '../../enums/chatMessageStatus'
import type {
  ChatMessageDirection
} from '../../enums/chatMessageDirection'
import type {
  ChatMessageBubbleBodyStyle,
  ChatMessageBubbleBodyTextStyle,
  ChatMessageBubbleContainerStyle,
  ChatMessageBubbleMetaDataContainerStyle,
  ChatMessageBubbleMetaDataStatusContainerStyle,
  ChatMessageBubbleMetaDataTextStyle,
  ChatMessageBubbleState
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'
import type { IconComponent } from '../../icons/types'

export type { ChatMessageDirection, ChatMessageStatus }

export type ChatMessageBubbleProps = Omit<ViewProps, 'children' | 'style'> & {
  direction: ChatMessageDirection,
  timestamp?: Date,
  messageStatus?: ChatMessageStatus,
  children?: ReactNode,
  style?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleContainerStyle>,
  bodyStyle?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleBodyStyle>,
  bodyTextStyle?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleBodyTextStyle>,
  metaDataContainerStyle?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleMetaDataContainerStyle>,
  metaDataStatusContainerStyle?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleMetaDataStatusContainerStyle>,
  metaDataTextStyle?: StyleOverwrite<ChatMessageBubbleState, ChatMessageBubbleMetaDataTextStyle>,
}

const resolveMessageStatusIcon = (messageStatus: ChatMessageStatus): IconComponent => (
  messageStatus === 'sent'
    ? HightideIconRegistry.Clock
    : HightideIconRegistry.CheckCheck
)

export const ChatMessageBubble = ({
  direction,
  timestamp,
  messageStatus,
  children,
  style,
  bodyStyle,
  bodyTextStyle,
  metaDataContainerStyle,
  metaDataStatusContainerStyle,
  metaDataTextStyle,
  ...props
}: ChatMessageBubbleProps) => {
  const { theme } = useTheme()
  const { locale } = useLocalization()
  const { is24HourFormat, timeZone } = useDateTimeFormat()
  const state = useMemo(() => ({ direction }), [direction])

  const resolvedContainerStyle = useMemo(
    () => theme.components.chat.messageBubble.container(state, style),
    [theme, state, style]
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
  const formattedTimestamp = useMemo(() => (
    timestamp === undefined
      ? undefined
      : DateUtils.formatAbsolute(timestamp, locale, 'time', { timeZone, is24HourFormat })
  ), [timestamp, locale, timeZone, is24HourFormat])
  const messageStatusIcon = useMemo(
    () => (messageStatus === undefined ? undefined : resolveMessageStatusIcon(messageStatus)),
    [messageStatus]
  )
  const messageStatusIconColor = useMemo(() => (
    messageStatus === 'read'
      ? theme.colors.primary.color
      : resolvedMetaDataIcon.color
  ), [messageStatus, resolvedMetaDataIcon.color, theme.colors.primary.color])

  return (
    <View {...props} style={resolvedContainerStyle}>
      <View style={resolvedBodyStyle}>
        {typeof children === 'string' || typeof children === 'number' ? (
          <ThemedText style={resolvedBodyTextStyle}>{children}</ThemedText>
        ) : (
          children
        )}
      </View>
      <View style={resolvedMetaDataContainerStyle}>
        {messageStatusIcon != null && (
          <View style={resolvedMetaDataStatusContainerStyle}>
            <ThemedIcon
              icon={messageStatusIcon}
              size={resolvedMetaDataIcon.size}
              strokeWidth={resolvedMetaDataIcon.strokeWidth}
              color={messageStatusIconColor}
            />
          </View>
        )}
        {formattedTimestamp != null && (
          <ThemedText style={resolvedMetaDataTextStyle}>{formattedTimestamp}</ThemedText>
        )}
      </View>
    </View>
  )
}
