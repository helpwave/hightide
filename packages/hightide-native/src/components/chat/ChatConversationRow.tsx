import {
  Fragment,
  useMemo,
  type ReactNode
} from 'react'
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import {
  Check,
  CheckCheck
} from 'lucide-react-native'

import { useTheme } from '@/src/global-contexts/theme/ThemeContext'
import type {
  ChatConversationRowPreviewStyle,
  ChatConversationRowState,
  ChatConversationRowStyle,
  ChatConversationRowTimestampStyle,
  ChatConversationRowTitleStyle
} from '@/src/theme/types/components/chat'
import type { StyleOverwrite } from '@/src/theme/types/resolver'

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
  const SentIndicatorIcon = sentIndicator === 'sentAndReceived' ? CheckCheck : Check

  const resolveState = (interaction: PressableInteraction): ChatConversationRowState => ({
    isUnread,
    isSelected,
    isDisabled: !!disabled,
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
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
    <Pressable
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
              <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                {typeof title === 'string' || typeof title === 'number' ? (
                  <Text style={resolvedTitle} numberOfLines={1}>{title}</Text>
                ) : (
                  title
                )}
                {timestamp != null && (
                  typeof timestamp === 'string' || typeof timestamp === 'number' ? (
                    <Text style={resolvedTimestamp}>{timestamp}</Text>
                  ) : (
                    timestamp
                  )
                )}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 0 }}>
                  {sentIndicator && (
                    <SentIndicatorIcon size={14} color={sentIndicatorColor} />
                  )}
                  {preview != null && (
                    typeof preview === 'string' || typeof preview === 'number' ? (
                      <Text style={resolvedPreview} numberOfLines={1}>{preview}</Text>
                    ) : (
                      preview
                    )
                  )}
                </View>
                {isUnread && (
                  <View style={unreadBadge}>
                    <Text style={unreadBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </Fragment>
        )
      }}
    </Pressable>
  )
}
