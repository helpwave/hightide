import type { ReactNode } from 'react'
import { Text, View, type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from 'react-native'
import { useTheme } from '../../global-contexts/theme'
import type { ChatThreadHeaderStyle } from '../../theme'

export type ChatThreadHeaderProps = Omit<ViewProps, 'style'> & {
  avatar?: ReactNode,
  title: ReactNode,
  subtitle?: ReactNode,
  leftActions?: ReactNode,
  rightActions?: ReactNode,
  style?: StyleProp<ViewStyle>,
  headerStyle?: StyleProp<ViewStyle> | ((style: ChatThreadHeaderStyle) => StyleProp<ViewStyle>),
  titleStyle?: StyleProp<TextStyle>,
  subtitleStyle?: StyleProp<TextStyle>,
}

export const ChatThreadHeader = ({
  avatar,
  title,
  subtitle,
  leftActions,
  rightActions,
  style,
  headerStyle,
  titleStyle,
  subtitleStyle,
  ...props
}: ChatThreadHeaderProps) => {
  const { theme } = useTheme()
  const resolvedHeader = theme.components.chat.threadHeader({})
  const resolvedTitle = theme.components.chat.threadHeaderTitle({})
  const resolvedSubtitle = theme.components.chat.threadHeaderSubtitle({})

  const appliedHeader = typeof headerStyle === 'function'
    ? headerStyle(resolvedHeader)
    : [resolvedHeader, headerStyle]

  return (
    <View {...props} style={[appliedHeader, style]}>
      {leftActions != null && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
          {leftActions}
        </View>
      )}
      {avatar}
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        {typeof title === 'string' || typeof title === 'number' ? (
          <Text style={[resolvedTitle, titleStyle]} numberOfLines={1}>{title}</Text>
        ) : (
          title
        )}
        {subtitle != null && (
          typeof subtitle === 'string' || typeof subtitle === 'number' ? (
            <Text style={[resolvedSubtitle, subtitleStyle]} numberOfLines={1}>{subtitle}</Text>
          ) : (
            subtitle
          )
        )}
      </View>
      {rightActions != null && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
          {rightActions}
        </View>
      )}
    </View>
  )
}
