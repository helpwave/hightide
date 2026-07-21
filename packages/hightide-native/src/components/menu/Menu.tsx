import type { ReactNode } from 'react'
import { Text, View, type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from 'react-native'
import { useTheme } from '../../global-contexts/theme'
import type {
  MenuCardStyle,
  MenuSectionStyle,
  MenuSectionTitleStyle
} from '../../theme'

export type MenuProps = Omit<ViewProps, 'children' | 'style'> & {
  title: string,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  sectionStyle?: StyleProp<ViewStyle> | ((style: MenuSectionStyle) => StyleProp<ViewStyle>),
  titleStyle?: StyleProp<TextStyle> | ((style: MenuSectionTitleStyle) => StyleProp<TextStyle>),
  cardStyle?: StyleProp<ViewStyle> | ((style: MenuCardStyle) => StyleProp<ViewStyle>),
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
  const resolvedSection = theme.components.menu.section({})
  const resolvedTitle = theme.components.menu.sectionTitle({})
  const resolvedCard = theme.components.menu.card({})

  const appliedSection = typeof sectionStyle === 'function'
    ? sectionStyle(resolvedSection)
    : [resolvedSection, sectionStyle]
  const appliedTitle = typeof titleStyle === 'function'
    ? titleStyle(resolvedTitle)
    : [resolvedTitle, titleStyle]
  const appliedCard = typeof cardStyle === 'function'
    ? cardStyle(resolvedCard)
    : [resolvedCard, cardStyle]

  return (
    <View {...props} style={[appliedSection, style]}>
      <Text style={appliedTitle}>{title}</Text>
      <View style={appliedCard}>{children}</View>
    </View>
  )
}
