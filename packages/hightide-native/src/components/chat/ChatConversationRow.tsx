import {
  useMemo,
  useState,
  type ReactNode
} from 'react'
import {
  View,
  type PressableProps
} from 'react-native'
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { ThemedText } from '../visualization-and-display/ThemedText'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import { interactionStateSet } from '../../theme/token-context'
import type {
  ChatConversationRowContentContainerStyle,
  ChatConversationRowHeaderRowStyle,
  ChatConversationRowMessageRowStyle,
  ChatConversationRowPreviewStyle,
  ChatConversationRowSentIndicatorStyle,
  ChatConversationRowTimestampStyle,
  ChatConversationRowTitleStyle,
  PressableContainerStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'
import {
  AvatarWithStatus,
  type AvatarWithStatusProps
} from '../visualization-and-display/Avatar'

import type { ChatMessageStatus } from '../../enums/chatMessageStatus'
import type { IconComponent } from '../../icons/types'
import { ThemedPressable } from '../user-interaction'

export type { ChatMessageStatus }

export type ChatConversationRowProps = Omit<PressableProps, 'children' | 'style'> & {
  avatarProps?: AvatarWithStatusProps,
  avatarOverride?: ReactNode,
  title: ReactNode,
  timestamp?: ReactNode,
  preview?: ReactNode,
  unreadCount?: number,
  isSelected?: boolean,
  messageStatus?: ChatMessageStatus,
  style?: StyleOverwrite<PressableContainerStyle>,
  contentContainerStyle?: StyleOverwrite<ChatConversationRowContentContainerStyle>,
  headerRowStyle?: StyleOverwrite<ChatConversationRowHeaderRowStyle>,
  messageRowStyle?: StyleOverwrite<ChatConversationRowMessageRowStyle>,
  titleStyle?: StyleOverwrite<ChatConversationRowTitleStyle>,
  timestampStyle?: StyleOverwrite<ChatConversationRowTimestampStyle>,
  previewStyle?: StyleOverwrite<ChatConversationRowPreviewStyle>,
  sentIndicatorStyle?: StyleOverwrite<ChatConversationRowSentIndicatorStyle>,
}

const resolveMessageStatusIcon = (messageStatus: ChatMessageStatus): IconComponent => (
  messageStatus === 'sent'
    ? HightideIconRegistry.Clock
    : HightideIconRegistry.CheckCheck
)

export const ChatConversationRow = ({
  avatarProps,
  avatarOverride,
  title,
  timestamp,
  preview,
  unreadCount,
  isSelected = false,
  messageStatus,
  disabled,
  style,
  contentContainerStyle,
  headerRowStyle,
  messageRowStyle,
  titleStyle,
  timestampStyle,
  previewStyle,
  sentIndicatorStyle,
  ...props
}: ChatConversationRowProps) => {
  const { theme } = useTheme()
  const [isPressed, setIsPressed] = useState(false)
  const isUnread = (unreadCount ?? 0) > 0
  const staticState = useMemo(() => ({
    state: interactionStateSet({
      isDisabled: !!disabled,
      isPressed,
    }, [
      ...(isUnread ? ['unread'] : []),
      ...(isSelected ? ['selected'] : []),
    ]),
  }), [disabled, isPressed, isSelected, isUnread])

  const resolvedContentContainer = useMemoizedTheme(theme.components.chat.conversationRow.contentContainer, staticState, contentContainerStyle)
  const resolvedHeaderRow = useMemoizedTheme(theme.components.chat.conversationRow.headerRow, staticState, headerRowStyle)
  const resolvedMessageRow = useMemoizedTheme(theme.components.chat.conversationRow.messageRow, staticState, messageRowStyle)
  const resolvedTitle = useMemoizedTheme(theme.components.chat.conversationRow.title, staticState, titleStyle)
  const resolvedTimestamp = useMemoizedTheme(theme.components.chat.conversationRow.timestamp, staticState, timestampStyle)
  const resolvedPreview = useMemoizedTheme(theme.components.chat.conversationRow.preview, staticState, previewStyle)
  const unreadBadge = useMemoizedTheme(theme.components.chat.conversationRow.unreadBadge, staticState)
  const unreadBadgeText = useMemoizedTheme(theme.components.chat.conversationRow.unreadBadgeText, staticState)
  const resolvedSentIndicator = useMemoizedTheme(theme.components.chat.conversationRow.sentIndicator, staticState, sentIndicatorStyle)
  const avatarSize = avatarProps?.size
  const messageStatusIcon = messageStatus === undefined
    ? undefined
    : resolveMessageStatusIcon(messageStatus)
  const messageStatusIconColor = messageStatus === 'read'
    ? theme.colors.primary.color
    : resolvedSentIndicator.color

  const {
    ...restAvatarProps
  } = avatarProps ?? {}

  return (
    <ThemedPressable
      {...props}
      disabled={disabled}
      size="md"
      coloringStyle="foreground"
      coloringColorVariant="transparent"
      style={style}
      onPressIn={(event) => {
        setIsPressed(true)
        props.onPressIn?.(event)
      }}
      onPressOut={(event) => {
        setIsPressed(false)
        props.onPressOut?.(event)
      }}
    >
      {avatarOverride ?? (
        <AvatarWithStatus
          {...restAvatarProps}
          size={avatarSize}
        />
      )}
      <View style={resolvedContentContainer}>
        <View style={resolvedHeaderRow}>
          {typeof title === 'string' || typeof title === 'number' ? (
            <ThemedText style={resolvedTitle} numberOfLines={1}>{title}</ThemedText>
          ) : (
            title
          )}
          {timestamp != null && (
            typeof timestamp === 'string' || typeof timestamp === 'number' ? (
              <ThemedText style={resolvedTimestamp}>{timestamp}</ThemedText>
            ) : (
              timestamp
            )
          )}
        </View>
        <View style={resolvedMessageRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: theme.spacing.xs }}>
            {messageStatusIcon != null && (
              <ThemedIcon
                icon={messageStatusIcon}
                size={resolvedSentIndicator.size}
                strokeWidth={resolvedSentIndicator.strokeWidth}
                color={messageStatusIconColor}
              />
            )}
            {preview != null && (
              typeof preview === 'string' || typeof preview === 'number' ? (
                <ThemedText style={[resolvedPreview, { flex: 1 }]} numberOfLines={1}>{preview}</ThemedText>
              ) : (
                preview
              )
            )}
          </View>
          {isUnread && (
            <View style={unreadBadge}>
              <ThemedText style={unreadBadgeText}>{unreadCount}</ThemedText>
            </View>
          )}
        </View>
      </View>
    </ThemedPressable>
  )
}
