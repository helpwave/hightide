import { useMemo, type ReactNode } from 'react'
import { Text, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native'
import type { ColoringType } from '@helpwave/hightide-design'
import { useTheme } from '../../global-contexts/theme'
import type {
  ChatMessageCardState,
  ChatMessageCardStyle,
  ChatMessageCardSubtitleStyle,
  ChatMessageCardTitleStyle,
  ChatMessageDirection,
  StyleOverwrite
} from '../../theme'

export type ChatMessageCardProps = Omit<ViewProps, 'children' | 'style'> & {
  icon?: ReactNode,
  title: ReactNode,
  subtitle?: ReactNode,
  badge?: ReactNode,
  actions?: ReactNode,
  color?: ColoringType,
  direction?: ChatMessageDirection,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  cardStyle?: StyleOverwrite<ChatMessageCardState, ChatMessageCardStyle>,
  titleStyle?: StyleOverwrite<ChatMessageCardState, ChatMessageCardTitleStyle>,
  subtitleStyle?: StyleOverwrite<Record<string, never>, ChatMessageCardSubtitleStyle>,
}

export const ChatMessageCard = ({
  icon,
  title,
  subtitle,
  badge,
  actions,
  color = 'primary',
  direction = 'incoming',
  children,
  style,
  cardStyle,
  titleStyle,
  subtitleStyle,
  ...props
}: ChatMessageCardProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({ direction, color }), [direction, color])
  const staticState = useMemo(() => ({}), [])

  const resolvedCardStyle = useMemo(
    () => theme.components.chat.messageCard(state, cardStyle),
    [theme, state, cardStyle]
  )
  const resolvedHeaderStyle = useMemo(
    () => theme.components.chat.messageCardHeader(staticState),
    [theme, staticState]
  )
  const resolvedIconStyle = useMemo(
    () => theme.components.chat.messageCardIcon(state),
    [theme, state]
  )
  const resolvedTitleStyle = useMemo(
    () => theme.components.chat.messageCardTitle(state, titleStyle),
    [theme, state, titleStyle]
  )
  const resolvedSubtitleStyle = useMemo(
    () => theme.components.chat.messageCardSubtitle(staticState, subtitleStyle),
    [theme, staticState, subtitleStyle]
  )
  const resolvedBodyStyle = useMemo(
    () => theme.components.chat.messageCardBody(staticState),
    [theme, staticState]
  )
  const resolvedActionsStyle = useMemo(
    () => theme.components.chat.messageCardActions(staticState),
    [theme, staticState]
  )

  return (
    <View {...props} style={[resolvedCardStyle, style]}>
      <View style={resolvedHeaderStyle}>
        {icon != null && (
          <View style={resolvedIconStyle}>{icon}</View>
        )}
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          {typeof title === 'string' || typeof title === 'number' ? (
            <Text style={resolvedTitleStyle}>{title}</Text>
          ) : (
            title
          )}
          {subtitle != null && (
            typeof subtitle === 'string' || typeof subtitle === 'number' ? (
              <Text style={resolvedSubtitleStyle}>{subtitle}</Text>
            ) : (
              subtitle
            )
          )}
        </View>
        {badge}
      </View>
      {children != null && (
        <View style={resolvedBodyStyle}>{children}</View>
      )}
      {actions != null && (
        <View style={resolvedActionsStyle}>{actions}</View>
      )}
    </View>
  )
}
