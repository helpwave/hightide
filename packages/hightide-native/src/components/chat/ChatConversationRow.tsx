import {
  cloneElement,
  isValidElement,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode
} from 'react'
import {
  StyleSheet,
  View,
  type PressableProps
} from 'react-native'
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { ThemedText } from '../visualization-and-display/ThemedText'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme, useMemoizedThemeFactory } from '../../hooks/useMemoizedTheme'
import type {
  AvatarState,
  AvatarStyle,
  AvatarThemeResolvers
} from '../../theme/types/components/avatar'
import type {
  ChatConversationRowContentContainerStyle,
  ChatConversationRowHeaderRowStyle,
  ChatConversationRowMessageRowStyle,
  ChatConversationRowPreviewStyle,
  ChatConversationRowSentIndicatorStyle,
  ChatConversationRowState,
  ChatConversationRowTimestampStyle,
  ChatConversationRowTitleStyle,
  PressableContainerStyle,
  PressableIconStyle,
  PressableState,
  PressableStateLayerStyle,
  PressableTextStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite, StyleResolverFunction } from '../../theme/types/resolver'
import type { AvatarProps } from '../visualization-and-display/Avatar'

import type { ChatMessageStatus } from '../../enums/chatMessageStatus'
import type { IconComponent } from '../../icons/types'
import { ThemedPressable } from '../user-interaction'

export type { ChatMessageStatus }

export type ChatConversationRowProps = Omit<PressableProps, 'children' | 'style'> & {
  avatar: ReactNode,
  title: ReactNode,
  timestamp?: ReactNode,
  preview?: ReactNode,
  unreadCount?: number,
  isSelected?: boolean,
  messageStatus?: ChatMessageStatus,
  style?: StyleOverwrite<PressableState, PressableContainerStyle>,
  contentContainerStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowContentContainerStyle>,
  headerRowStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowHeaderRowStyle>,
  messageRowStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowMessageRowStyle>,
  titleStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowTitleStyle>,
  timestampStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowTimestampStyle>,
  previewStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowPreviewStyle>,
  sentIndicatorStyle?: StyleOverwrite<Record<string, never>, ChatConversationRowSentIndicatorStyle>,
  avatarStyle?: StyleOverwrite<AvatarState, AvatarStyle>,
}

type ConversationRowPressableResolvers = {
  container: StyleResolverFunction<PressableState, PressableContainerStyle>,
  stateLayer: StyleResolverFunction<PressableState, PressableStateLayerStyle>,
  text: StyleResolverFunction<PressableState, PressableTextStyle>,
  icon: StyleResolverFunction<PressableState, PressableIconStyle>,
}

type AvatarElementProps = AvatarProps & {
  avatarStyle?: AvatarProps['avatarStyle'],
}

const toNumericSize = (value: unknown): number | undefined => (
  typeof value === 'number' ? value : undefined
)

const resolveMessageStatusIcon = (messageStatus: ChatMessageStatus): IconComponent => (
  messageStatus === 'sent'
    ? HightideIconRegistry.Clock
    : HightideIconRegistry.CheckCheck
)

export const ChatConversationRow = ({
  avatar,
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
  avatarStyle,
  ...props
}: ChatConversationRowProps) => {
  const { theme } = useTheme()
  const [isPressed, setIsPressed] = useState(false)
  const isUnread = (unreadCount ?? 0) > 0
  const staticState = useMemo(() => ({}), [])

  const rowState = useMemo((): ChatConversationRowState => ({
    isUnread,
    isSelected,
    isDisabled: !!disabled,
    isPressed,
  }), [disabled, isPressed, isSelected, isUnread])

  const pressableThemeState = useMemo((): PressableState => ({
    isPressed,
    isDisabled: !!disabled,
  }), [disabled, isPressed])

  const pressableResolvers = useMemoizedThemeFactory<
    ChatConversationRowState,
    ConversationRowPressableResolvers
  >(theme.components.chat.conversationRow.pressable, rowState)

  const resolvedContainerStyle = useMemoizedTheme(pressableResolvers.container, pressableThemeState, style)
  const resolvedStateLayerStyle = useMemoizedTheme(pressableResolvers.stateLayer, pressableThemeState)
  const resolvedContentContainer = useMemoizedTheme(theme.components.chat.conversationRow.contentContainer, rowState, contentContainerStyle)
  const resolvedHeaderRow = useMemoizedTheme(theme.components.chat.conversationRow.headerRow, rowState, headerRowStyle)
  const resolvedMessageRow = useMemoizedTheme(theme.components.chat.conversationRow.messageRow, rowState, messageRowStyle)
  const resolvedTitle = useMemoizedTheme(theme.components.chat.conversationRow.title, rowState, titleStyle)
  const resolvedTimestamp = useMemoizedTheme(theme.components.chat.conversationRow.timestamp, rowState, timestampStyle)
  const resolvedPreview = useMemoizedTheme(theme.components.chat.conversationRow.preview, rowState, previewStyle)
  const unreadBadge = useMemoizedTheme(theme.components.chat.conversationRow.unreadBadge, staticState)
  const unreadBadgeText = useMemoizedTheme(theme.components.chat.conversationRow.unreadBadgeText, staticState)
  const resolvedSentIndicator = useMemoizedTheme(theme.components.chat.conversationRow.sentIndicator, staticState, sentIndicatorStyle)
  const avatarTheme = useMemoizedThemeFactory<AvatarState, AvatarThemeResolvers>(
    theme.components.chat.conversationRow.avatar,
    staticState
  )
  const avatarSize = useMemo(
    () => toNumericSize(StyleSheet.flatten(avatarTheme.container({})).width),
    [avatarTheme]
  )
  const messageStatusIcon = messageStatus === undefined
    ? undefined
    : resolveMessageStatusIcon(messageStatus)
  const messageStatusIconColor = messageStatus === 'read'
    ? theme.colors.primary.color
    : resolvedSentIndicator.color

  const resolvedAvatar = useMemo(() => {
    if (!isValidElement(avatar) || avatarSize === undefined) {
      return avatar
    }

    const avatarElement = avatar as ReactElement<AvatarElementProps>

    return cloneElement(avatarElement, {
      size: avatarSize,
      avatarStyle: (avatarState) => avatarTheme.container(
        {
          ...avatarState,
          size: avatarSize,
        },
        avatarStyle ?? avatarElement.props.avatarStyle
      ),
      imageStyle: (avatarState) => avatarTheme.image(
        {
          ...avatarState,
          size: avatarSize,
        },
        avatarElement.props.imageStyle
      ),
      textStyle: (avatarState) => avatarTheme.text(
        {
          ...avatarState,
          size: avatarSize,
        },
        avatarElement.props.textStyle
      ),
      iconStyle: (avatarState) => avatarTheme.icon(
        {
          ...avatarState,
          size: avatarSize,
        },
        avatarElement.props.iconStyle
      ),
    })
  }, [avatar, avatarSize, avatarStyle, avatarTheme])

  return (
    <ThemedPressable
      {...props}
      disabled={disabled}
      style={resolvedContainerStyle}
      stateLayerStyle={resolvedStateLayerStyle}
      onPressIn={(event) => {
        setIsPressed(true)
        props.onPressIn?.(event)
      }}
      onPressOut={(event) => {
        setIsPressed(false)
        props.onPressOut?.(event)
      }}
    >
      {resolvedAvatar}
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
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: theme.spacing.sm }}>
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
                <ThemedText style={resolvedPreview} numberOfLines={1}>{preview}</ThemedText>
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
