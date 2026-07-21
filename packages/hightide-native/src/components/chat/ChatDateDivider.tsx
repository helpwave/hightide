import { useMemo, type ReactNode } from 'react'
import { Text, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native'
import { useTheme } from '../../global-contexts/theme'
import type {
  ChatDateDividerStyle,
  ChatDateDividerTextStyle,
  StyleOverwrite
} from '../../theme'

export type ChatDateDividerProps = Omit<ViewProps, 'children' | 'style'> & {
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  dividerStyle?: StyleOverwrite<Record<string, never>, ChatDateDividerStyle>,
  textStyle?: StyleOverwrite<Record<string, never>, ChatDateDividerTextStyle>,
}

export const ChatDateDivider = ({
  children,
  style,
  dividerStyle,
  textStyle,
  ...props
}: ChatDateDividerProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({}), [])

  const resolvedDividerStyle = useMemo(
    () => theme.components.chat.dateDivider(state, dividerStyle),
    [theme, state, dividerStyle]
  )
  const resolvedTextStyle = useMemo(
    () => theme.components.chat.dateDividerText(state, textStyle),
    [theme, state, textStyle]
  )

  return (
    <View {...props} style={[resolvedDividerStyle, style]}>
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text style={resolvedTextStyle}>{children}</Text>
      ) : (
        children
      )}
    </View>
  )
}
