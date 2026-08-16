import {
  Fragment,
  useMemo,
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
  ChatConversationRowPreviewStyle,
  ChatConversationRowState,
  ChatConversationRowStyle,
  ChatConversationRowTimestampStyle,
  ChatConversationRowTitleStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { ThemedPressable } from '../user-interaction'

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
  titleStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowTitleStyle>,
  timestampStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowTimestampStyle>,
  previewStyle?: StyleOverwrite<ChatConversationRowState, ChatConversationRowPreviewStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
  focusVisible?: boolean,
}

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
  titleStyle,
  timestampStyle,
  previewStyle,
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
  const sentIndicatorColor = useMemo(
    () => theme.components.chat.conversationRow.sentIndicator(staticState).color,
    [theme, staticState]
  )

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
        const resolvedTitle = theme.components.chat.conversationRow.title(state, titleStyle)
        const resolvedTimestamp = theme.components.chat.conversationRow.timestamp(state, timestampStyle)
        const resolvedPreview = theme.components.chat.conversationRow.preview(state, previewStyle)

        return (
          <Fragment>
            {avatar}
            <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
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
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 0 }}>
                  {sentIndicator && (
                    <ThemedIcon
                      icon={sentIndicatorIcon}
                      size={16}
                      color={sentIndicatorColor}
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
          </Fragment>
        )
      }}
    </ThemedPressable>
  )
}
