import { type ReactNode } from 'react'
import { Text, View, type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from 'react-native'
import { useTheme } from '../../global-contexts/theme'
import type {
  MenuItemLabelStyle,
  MenuItemStyle,
  MenuItemValueStyle
} from '../../theme'

export type MenuItemProps = Omit<ViewProps, 'style'> & {
  label: string,
  value: string,
  leading?: ReactNode,
  trailing?: ReactNode,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleProp<ViewStyle> | ((style: MenuItemStyle) => StyleProp<ViewStyle>),
  labelStyle?: StyleProp<TextStyle> | ((style: MenuItemLabelStyle) => StyleProp<TextStyle>),
  valueStyle?: StyleProp<TextStyle> | ((style: MenuItemValueStyle) => StyleProp<TextStyle>),
}

export const MenuItem = ({
  label,
  value,
  leading,
  trailing,
  style,
  itemStyle,
  labelStyle,
  valueStyle,
  ...props
}: MenuItemProps) => {
  const { theme } = useTheme()
  const resolvedItem = theme.components.menu.item({})
  const resolvedContent = theme.components.menu.itemContent({})
  const resolvedLabel = theme.components.menu.itemLabel({})
  const resolvedValue = theme.components.menu.itemValue({})

  const appliedItem = typeof itemStyle === 'function'
    ? itemStyle(resolvedItem)
    : [resolvedItem, itemStyle]
  const appliedLabel = typeof labelStyle === 'function'
    ? labelStyle(resolvedLabel)
    : [resolvedLabel, labelStyle]
  const appliedValue = typeof valueStyle === 'function'
    ? valueStyle(resolvedValue)
    : [resolvedValue, valueStyle]

  return (
    <View {...props} style={[appliedItem, style]}>
      {leading}
      <View style={resolvedContent}>
        <Text style={appliedLabel}>{label}</Text>
        <Text style={appliedValue}>{value}</Text>
      </View>
      {trailing}
    </View>
  )
}
