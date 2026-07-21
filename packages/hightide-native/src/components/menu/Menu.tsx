import { useMemo, type ReactNode } from 'react'
import { Text, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native'
import { useTheme } from '../../global-contexts/theme'
import type {
  MenuCardStyle,
  MenuSectionStyle,
  MenuSectionTitleStyle,
  StyleOverwrite
} from '../../theme'

export type MenuProps = Omit<ViewProps, 'children' | 'style'> & {
  title: string,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  sectionStyle?: StyleOverwrite<Record<string, never>, MenuSectionStyle>,
  titleStyle?: StyleOverwrite<Record<string, never>, MenuSectionTitleStyle>,
  cardStyle?: StyleOverwrite<Record<string, never>, MenuCardStyle>,
}

export const Menu = ({
  title,
  children,
  style,
  sectionStyle,
  titleStyle,
  cardStyle,
  ...props
}: MenuProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({}), [])

  const resolvedSectionStyle = useMemo(
    () => theme.components.menu.section(state, sectionStyle),
    [theme, state, sectionStyle]
  )
  const resolvedTitleStyle = useMemo(
    () => theme.components.menu.sectionTitle(state, titleStyle),
    [theme, state, titleStyle]
  )
  const resolvedCardStyle = useMemo(
    () => theme.components.menu.card(state, cardStyle),
    [theme, state, cardStyle]
  )

  return (
    <View {...props} style={[resolvedSectionStyle, style]}>
      <Text style={resolvedTitleStyle}>{title}</Text>
      <View style={resolvedCardStyle}>{children}</View>
    </View>
  )
}
