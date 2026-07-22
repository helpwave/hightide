import {
  useMemo,
  type ReactNode
} from 'react'
import {
  Text,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'

import { useTheme } from '@/src/global-contexts/theme/ThemeContext'
import type {
  MenuItemLabelStyle,
  MenuItemStyle,
  MenuItemValueStyle
} from '@/src/theme/types/components/menu'
import type { StyleOverwrite } from '@/src/theme/types/resolver'

export type MenuItemProps = Omit<ViewProps, 'style'> & {
  label: string,
  value: string,
  leading?: ReactNode,
  trailing?: ReactNode,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<Record<string, never>, MenuItemStyle>,
  labelStyle?: StyleOverwrite<Record<string, never>, MenuItemLabelStyle>,
  valueStyle?: StyleOverwrite<Record<string, never>, MenuItemValueStyle>,
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
  const state = useMemo(() => ({}), [])

  const resolvedItemStyle = useMemo(
    () => theme.components.menu.item(state, itemStyle),
    [theme, state, itemStyle]
  )
  const resolvedContentStyle = useMemo(
    () => theme.components.menu.itemContent(state),
    [theme, state]
  )
  const resolvedLabelStyle = useMemo(
    () => theme.components.menu.itemLabel(state, labelStyle),
    [theme, state, labelStyle]
  )
  const resolvedValueStyle = useMemo(
    () => theme.components.menu.itemValue(state, valueStyle),
    [theme, state, valueStyle]
  )

  return (
    <View {...props} style={[resolvedItemStyle, style]}>
      {leading}
      <View style={resolvedContentStyle}>
        <Text style={resolvedLabelStyle}>{label}</Text>
        <Text style={resolvedValueStyle}>{value}</Text>
      </View>
      {trailing}
    </View>
  )
}
