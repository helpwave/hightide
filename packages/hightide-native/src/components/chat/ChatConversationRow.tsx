import { Fragment, type ReactNode } from 'react'
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from 'react-native'
import { Check, CheckCheck } from 'lucide-react-native'
import { useTheme } from '../../global-contexts/theme'
import type { ChatConversationRowStyle } from '../../theme'

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
  rowStyle?: StyleProp<ViewStyle> | ((style: ChatConversationRowStyle) => StyleProp<ViewStyle>),
  titleStyle?: StyleProp<TextStyle>,
  timestampStyle?: StyleProp<TextStyle>,
  previewStyle?: StyleProp<TextStyle>,
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

  const resolveStyles = (interaction: PressableInteraction) => {
    const state = {
      isUnread,
      isSelected,
      isDisabled: !!disabled,
      isPressed: interaction.pressed,
      isHovered: !!interaction.hovered,
      isFocused: !!interaction.focused,
    }

    const resolvedRow = theme.components.chat.conversationRow(state)
    const resolvedTitle = theme.components.chat.conversationRowTitle(state)
    const resolvedTimestamp = theme.components.chat.conversationRowTimestamp(state)
    const resolvedPreview = theme.components.chat.conversationRowPreview(state)

    return {
      row: typeof rowStyle === 'function' ? rowStyle(resolvedRow) : [resolvedRow, rowStyle],
      title: [resolvedTitle, titleStyle],
      timestamp: [resolvedTimestamp, timestampStyle],
      preview: [resolvedPreview, previewStyle],
    }
  }

  const unreadBadge = theme.components.chat.conversationRowUnreadBadge({})
  const unreadBadgeText = theme.components.chat.conversationRowUnreadBadgeText({})
  const sentIndicatorColor = theme.components.chat.conversationRowSentIndicator({}).color

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={(pressableState) => {
        const resolved = resolveStyles(pressableState as PressableInteraction)
        return [resolved.row, style]
      }}
    >
      {(pressableState) => {
        const resolved = resolveStyles(pressableState as PressableInteraction)

        return (
          <Fragment>
            {avatar}
            <View style={{ flex: 1, minWidth: 0, gap: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                {typeof title === 'string' || typeof title === 'number' ? (
                  <Text style={resolved.title} numberOfLines={1}>{title}</Text>
                ) : (
                  title
                )}
                {timestamp != null && (
                  typeof timestamp === 'string' || typeof timestamp === 'number' ? (
                    <Text style={resolved.timestamp}>{timestamp}</Text>
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
                      <Text style={resolved.preview} numberOfLines={1}>{preview}</Text>
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
