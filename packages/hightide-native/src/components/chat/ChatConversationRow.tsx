import {
  cloneElement,
  Fragment,
  isValidElement,
  useMemo,
  type ReactElement,
  type ReactNode
} from 'react'
import {
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { ThemedText } from '../visualization-and-display/ThemedText'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  AvatarState,
  AvatarStyle
} from '../../theme/types/components/avatar'
import type {
  ChatConversationRowContentContainerStyle,
  ChatConversationRowHeaderRowStyle,
  ChatConversationRowMessageRowStyle,
  ChatConversationRowPreviewStyle,
  ChatConversationRowSentIndicatorStyle,
  ChatConversationRowState,
  ChatConversationRowStyle,
  ChatConversationRowTimestampStyle,
  ChatConversationRowTitleStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { ThemedPressable } from '../user-interaction'
import type { AvatarProps } from '../visualization-and-display/Avatar'

export type ChatConversationSentIndicator = 'sent' | 'sentAndReceived'

export type ChatConversationRowProps = Omit<PressableProps, 'children' | 'style'> & {
  avatar: ReactNode,
  title: ReactNode,
  timestamp?: ReactNode,
  preview?: ReactNode,
  unreadCount?: number,
  isSelected?: boolean,
  sentIndicator?: ChatConversationSentIndicator,
  style?: StyleProp<ViewStyle>,
  rowStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowStyle>,
  contentContainerStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowContentContainerStyle>,
  headerRowStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowHeaderRowStyle>,
  messageRowStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowMessageRowStyle>,
  titleStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowTitleStyle>,
  timestampStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowTimestampStyle>,
  previewStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowPreviewStyle>,
  sentIndicatorStyle?: StyleOverwrite<Record<string, never>, ChatConversationRowSentIndicatorStyle>,
  avatarStyle?: StyleOverwrite<AvatarState, AvatarStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
  focusVisible?: boolean,
}

type AvatarElementProps = AvatarProps & {
  avatarStyle?: AvatarProps['avatarStyle'],
}

const toNumericSize = (value: unknown): number | undefined => (
  typeof value === 'number' ? value : undefined
)

export const ChatConversationRow = ({
  avatar,
  title,
  timestamp,
  preview,
  unreadCount,
  isSelected = false,
  sentIndicator,
  disabled,
  style,
  rowStyle,
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
  const isUnread = (unreadCount ?? 0) > 0
  const sentIndicatorIcon = sentIndicator === 'sentAndReceived'
    ? HightideIconRegistry.CheckCheck
    : HightideIconRegistry.Check

  const resolveState = (interaction: PressableInteraction): ChatConversationRowState => ({
    isUnread,
    isSelected,
    isDisabled: !!disabled,
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
    isFocusVisible: !!interaction.focusVisible,
  })

  const staticState = useMemo(() => ({}), [])
  const unreadBadge = useMemo(
    () => theme.components.chat.conversationRow.unreadBadge(staticState),
    [theme, staticState]
  )
  const unreadBadgeText = useMemo(
    () => theme.components.chat.conversationRow.unreadBadgeText(staticState),
    [theme, staticState]
  )
  const resolvedSentIndicator = useMemo(
    () => theme.components.chat.conversationRow.sentIndicator(staticState, sentIndicatorStyle),
    [theme, staticState, sentIndicatorStyle]
  )
  const avatarTheme = useMemo(
    () => theme.components.chat.conversationRow.avatar(staticState),
    [theme, staticState]
  )
  const avatarSize = useMemo(
    () => toNumericSize(avatarTheme.container({}).width),
    [avatarTheme]
  )

  const resolvedAvatar = useMemo(() => {
    if (!isValidElement(avatar) || avatarSize === undefined) {
      return avatar
    }

    const avatarElement = avatar as ReactElement<AvatarElementProps>

    return cloneElement(avatarElement, {
      size: avatarSize,
      avatarStyle: (_, avatarState) => avatarTheme.container(
        {
          ...avatarState,
          size: avatarSize,
        },
        avatarStyle ?? avatarElement.props.avatarStyle
      ),
      imageStyle: (_, avatarState) => avatarTheme.image(
        {
          ...avatarState,
          size: avatarSize,
        },
        avatarElement.props.imageStyle
      ),
      textStyle: (_, avatarState) => avatarTheme.text(
        {
          ...avatarState,
          size: avatarSize,
        },
        avatarElement.props.textStyle
      ),
      iconStyle: (_, avatarState) => avatarTheme.icon(
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
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return [theme.components.chat.conversationRow.container(state, rowStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedContentContainer = theme.components.chat.conversationRow.contentContainer(
          state,
          contentContainerStyle
        )
        const resolvedHeaderRow = theme.components.chat.conversationRow.headerRow(state, headerRowStyle)
        const resolvedMessageRow = theme.components.chat.conversationRow.messageRow(state, messageRowStyle)
        const resolvedTitle = theme.components.chat.conversationRow.title(state, titleStyle)
        const resolvedTimestamp = theme.components.chat.conversationRow.timestamp(state, timestampStyle)
        const resolvedPreview = theme.components.chat.conversationRow.preview(state, previewStyle)

        return (
          <Fragment>
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
                {sentIndicator && (
                  <ThemedIcon
                    icon={sentIndicatorIcon}
                    size={resolvedSentIndicator.size}
                    strokeWidth={resolvedSentIndicator.strokeWidth}
                    color={resolvedSentIndicator.color}
                  />
                )}
                {preview != null && (
                  typeof preview === 'string' || typeof preview === 'number' ? (
                    <ThemedText style={resolvedPreview} numberOfLines={1}>{preview}</ThemedText>
                  ) : (
                    preview
                  )
                )}
                {isUnread && (
                  <View style={unreadBadge}>
                    <ThemedText style={unreadBadgeText}>{unreadCount}</ThemedText>
                  </View>
                )}
              </View>
            </View>
          </Fragment>
        )
      }}
    </ThemedPressable>
  )
}
