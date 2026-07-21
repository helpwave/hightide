import type { ReactNode } from 'react'
import { Text, View, type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from 'react-native'
import { useTheme } from '../../global-contexts/theme'
import type { ChatDateDividerStyle, ChatDateDividerTextStyle } from '../../theme'

export type ChatDateDividerProps = Omit<ViewProps, 'children' | 'style'> & {
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  dividerStyle?: StyleProp<ViewStyle> | ((style: ChatDateDividerStyle) => StyleProp<ViewStyle>),
  textStyle?: StyleProp<TextStyle> | ((style: ChatDateDividerTextStyle) => StyleProp<TextStyle>),
}

export const ChatDateDivider = ({
  children,
  style,
  dividerStyle,
  textStyle,
  ...props
}: ChatDateDividerProps) => {
  const { theme } = useTheme()
  const resolvedDivider = theme.components.chat.dateDivider({})
  const resolvedText = theme.components.chat.dateDividerText({})

  const appliedDivider = typeof dividerStyle === 'function'
    ? dividerStyle(resolvedDivider)
    : [resolvedDivider, dividerStyle]
  const appliedText = typeof textStyle === 'function'
    ? textStyle(resolvedText)
    : [resolvedText, textStyle]

  return (
    <View {...props} style={[appliedDivider, style]}>
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text style={appliedText}>{children}</Text>
      ) : (
        children
      )}
    </View>
  )
}
