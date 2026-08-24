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
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type {
  ListItemDescriptionStyle,
  ListItemState,
  ListItemStyle,
  ListItemTitleStyle
} from '../../theme/types/components/listItem'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { ListItemAccessory } from './ListItemAccessory'
import {
  ListItemTextContent,
  type ListItemContentOrder
} from './ListItemTextContent'

export type ListItemProps = Omit<ViewProps, 'style'> & {
  title?: string,
  subtitle?: string,
  content?: ReactNode,
  contentOrder?: ListItemContentOrder,
  leading?: ReactNode,
  trailing?: ReactNode,
  color?: ColorPairToken,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<ListItemState, ListItemStyle>,
  titleStyle?: StyleOverwrite<ListItemState, ListItemTitleStyle>,
  subtitleStyle?: StyleOverwrite<ListItemState, ListItemDescriptionStyle>,
}

export const ListItem = ({
  title,
  subtitle,
  content,
  contentOrder = 'subtitleFirst',
  leading,
  trailing,
  color,
  style,
  itemStyle,
  titleStyle,
  subtitleStyle,
  ...props
}: ListItemProps) => {
  const { theme } = useTheme()
  const state = useMemo((): ListItemState => ({
    color,
  }), [color])

  const resolvedItemStyle = useMemoizedTheme(theme.components.listItem.default.container, state, itemStyle)
  const resolvedLeadingItemContainerStyle = useMemoizedTheme(theme.components.listItem.default.leadingItemContainer, state)
  const resolvedContentStyle = useMemoizedTheme(theme.components.listItem.default.content, state)
  const resolvedTrailingItemContainerStyle = useMemoizedTheme(theme.components.listItem.default.trailingItemContainer, state)
  const resolvedTitleStyle = useMemoizedTheme(theme.components.listItem.default.titleText, state, titleStyle)
  const resolvedSubtitleStyle = useMemoizedTheme(theme.components.listItem.default.descriptionText, state, subtitleStyle)
  const resolvedIconStyle = useMemoizedTheme(theme.components.listItem.default.icon, state)

  return (
    <View {...props} style={[resolvedItemStyle, style]}>
      {leading != null && (
        <ListItemAccessory
          style={resolvedLeadingItemContainerStyle}
          foreground={color?.onColor}
          iconStyle={resolvedIconStyle}
        >
          {leading}
        </ListItemAccessory>
      )}
      <View style={resolvedContentStyle}>
        <ListItemTextContent
          title={title}
          subtitle={subtitle}
          content={content}
          contentOrder={contentOrder}
          titleStyle={resolvedTitleStyle}
          subtitleStyle={resolvedSubtitleStyle}
        />
      </View>
      {trailing != null && (
        <ListItemAccessory
          style={resolvedTrailingItemContainerStyle}
          foreground={color?.onColor}
          iconStyle={resolvedIconStyle}
        >
          {trailing}
        </ListItemAccessory>
      )}
    </View>
  )
}
