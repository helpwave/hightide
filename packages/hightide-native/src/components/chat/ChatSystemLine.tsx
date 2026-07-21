import type { ReactNode } from 'react'
import { Text, View, type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from 'react-native'
import { CheckCheck } from 'lucide-react-native'
import type { ColoringType } from '@helpwave/hightide-design'
import { useTheme } from '../../global-contexts/theme'
import type { ChatSystemLineStyle, ChatSystemLineTextStyle } from '../../theme'

export type ChatSystemLineProps = Omit<ViewProps, 'children' | 'style'> & {
  icon?: ReactNode,
  color?: ColoringType,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  lineStyle?: StyleProp<ViewStyle> | ((style: ChatSystemLineStyle) => StyleProp<ViewStyle>),
  textStyle?: StyleProp<TextStyle> | ((style: ChatSystemLineTextStyle) => StyleProp<TextStyle>),
}

export const ChatSystemLine = ({
  icon,
  color = 'primary',
  children,
  style,
  lineStyle,
  textStyle,
  ...props
}: ChatSystemLineProps) => {
  const { theme } = useTheme()
  const state = { color }
  const resolvedLine = theme.components.chat.systemLine(state)
  const resolvedText = theme.components.chat.systemLineText(state)
  const resolvedIcon = theme.components.chat.systemLineIcon(state)

  const appliedLine = typeof lineStyle === 'function'
    ? lineStyle(resolvedLine)
    : [resolvedLine, lineStyle]
  const appliedText = typeof textStyle === 'function'
    ? textStyle(resolvedText)
    : [resolvedText, textStyle]

  return (
    <View {...props} style={[appliedLine, style]}>
      {icon ?? <CheckCheck size={14} color={resolvedIcon.color} />}
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text style={appliedText}>{children}</Text>
      ) : (
        children
      )}
    </View>
  )
}
