import {
  useMemo,
  type ReactNode
} from 'react'
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { ThemedText } from '../visualization-and-display/ThemedText'
import type {
  ListItemDescriptionStyle,
  ListItemState,
  ListItemStyle,
  ListItemTitleStyle
} from '../../theme/types/components/listItem'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type ListItemProps = Omit<ViewProps, 'style'> & {
  label: string,
  value: string,
  leading?: ReactNode,
  trailing?: ReactNode,
  color?: ColorPairToken,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<ListItemState, ListItemStyle>,
  labelStyle?: StyleOverwrite<ListItemState, ListItemDescriptionStyle>,
  valueStyle?: StyleOverwrite<ListItemState, ListItemTitleStyle>,
}

export const ListItem = ({
  label,
  value,
  leading,
  trailing,
  color,
  style,
  itemStyle,
  labelStyle,
  valueStyle,
  ...props
}: ListItemProps) => {
  const { theme } = useTheme()
  const state = useMemo((): ListItemState => ({ color }), [color])

  const resolvedItemStyle = useMemo(
    () => theme.components.listItem.default.container(state, itemStyle),
    [theme, state, itemStyle]
  )
  const resolvedContentStyle = useMemo(
    () => theme.components.listItem.default.content(state),
    [theme, state]
  )
  const resolvedLabelStyle = useMemo(
    () => theme.components.listItem.default.descriptionText(state, labelStyle),
    [theme, state, labelStyle]
  )
  const resolvedValueStyle = useMemo(
    () => theme.components.listItem.default.titleText(state, valueStyle),
    [theme, state, valueStyle]
  )

  return (
    <View {...props} style={[resolvedItemStyle, style]}>
      {leading}
      <View style={resolvedContentStyle}>
        <ThemedText style={resolvedLabelStyle}>{label}</ThemedText>
        <ThemedText style={resolvedValueStyle}>{value}</ThemedText>
      </View>
      {trailing}
    </View>
  )
}
