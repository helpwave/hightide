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

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  CardItemLabelStyle,
  CardItemStyle,
  CardItemValueStyle
} from '../../theme/types/components/card'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type CardItemProps = Omit<ViewProps, 'style'> & {
  label: string,
  value: string,
  leading?: ReactNode,
  trailing?: ReactNode,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<Record<string, never>, CardItemStyle>,
  labelStyle?: StyleOverwrite<Record<string, never>, CardItemLabelStyle>,
  valueStyle?: StyleOverwrite<Record<string, never>, CardItemValueStyle>,
}

export const CardItem = ({
  label,
  value,
  leading,
  trailing,
  style,
  itemStyle,
  labelStyle,
  valueStyle,
  ...props
}: CardItemProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({}), [])

  const resolvedItemStyle = useMemo(
    () => theme.components.card.item(state, itemStyle),
    [theme, state, itemStyle]
  )
  const resolvedContentStyle = useMemo(
    () => theme.components.card.itemContent(state),
    [theme, state]
  )
  const resolvedLabelStyle = useMemo(
    () => theme.components.card.itemLabel(state, labelStyle),
    [theme, state, labelStyle]
  )
  const resolvedValueStyle = useMemo(
    () => theme.components.card.itemValue(state, valueStyle),
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
