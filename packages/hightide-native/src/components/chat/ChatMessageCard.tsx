import type { ReactNode } from 'react'
import { Text, View, type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from 'react-native'
import type { ColoringType } from '@helpwave/hightide-design'
import { useTheme } from '../../global-contexts/theme'
import type {
  ChatMessageCardStyle,
  ChatMessageDirection
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
  cardStyle?: StyleProp<ViewStyle> | ((style: ChatMessageCardStyle) => StyleProp<ViewStyle>),
  titleStyle?: StyleProp<TextStyle>,
  subtitleStyle?: StyleProp<TextStyle>,
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
  const state = { direction, color }
  const resolvedCard = theme.components.chat.messageCard(state)
  const resolvedHeader = theme.components.chat.messageCardHeader({})
  const resolvedIcon = theme.components.chat.messageCardIcon(state)
  const resolvedTitle = theme.components.chat.messageCardTitle(state)
  const resolvedSubtitle = theme.components.chat.messageCardSubtitle({})
  const resolvedBody = theme.components.chat.messageCardBody({})
  const resolvedActions = theme.components.chat.messageCardActions({})

  const appliedCard = typeof cardStyle === 'function'
    ? cardStyle(resolvedCard)
    : [resolvedCard, cardStyle]

  return (
    <View {...props} style={[appliedCard, style]}>
      <View style={resolvedHeader}>
        {icon != null && (
          <View style={resolvedIcon}>{icon}</View>
        )}
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          {typeof title === 'string' || typeof title === 'number' ? (
            <Text style={[resolvedTitle, titleStyle]}>{title}</Text>
          ) : (
            title
          )}
          {subtitle != null && (
            typeof subtitle === 'string' || typeof subtitle === 'number' ? (
              <Text style={[resolvedSubtitle, subtitleStyle]}>{subtitle}</Text>
            ) : (
              subtitle
            )
          )}
        </View>
        {badge}
      </View>
      {children != null && (
        <View style={resolvedBody}>{children}</View>
      )}
      {actions != null && (
        <View style={resolvedActions}>{actions}</View>
      )}
    </View>
  )
}
