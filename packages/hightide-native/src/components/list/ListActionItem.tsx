import {
  Fragment,
  type ReactNode
} from 'react'
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  ListActionItemDescriptionStyle,
  ListActionItemState,
  ListActionItemStyle,
  ListActionItemTitleStyle
} from '../../theme/types/components/listItem'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { ListItemAccessory } from './ListItemAccessory'
import {
  ListItemTextContent,
  type ListItemContentOrder
} from './ListItemTextContent'

export type ListActionItemProps = Omit<PressableProps, 'children' | 'style'> & {
  title?: string,
  subtitle?: string,
  content?: ReactNode,
  contentOrder?: ListItemContentOrder,
  leading?: ReactNode,
  trailing?: ReactNode,
  color?: ColorPairToken,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<ListActionItemState, ListActionItemStyle>,
  titleStyle?: StyleOverwrite<ListActionItemState, ListActionItemTitleStyle>,
  subtitleStyle?: StyleOverwrite<ListActionItemState, ListActionItemDescriptionStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
  focusVisible?: boolean,
}

export const ListActionItem = ({
  title,
  subtitle,
  content,
  contentOrder = 'titleFirst',
  leading,
  trailing,
  color,
  disabled,
  style,
  itemStyle,
  titleStyle,
  subtitleStyle,
  ...props
}: ListActionItemProps) => {
  const { theme } = useTheme()

  const resolveState = (interaction: PressableInteraction): ListActionItemState => ({
    color,
    isDisabled: !!disabled,
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
    isFocusVisible: !!interaction.focusVisible,
  })

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return [theme.components.listItem.action.container(state, itemStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedLeadingItemContainerStyle = theme.components.listItem.action.leadingItemContainer(state)
        const resolvedContentStyle = theme.components.listItem.action.content(state)
        const resolvedTrailingItemContainerStyle = theme.components.listItem.action.trailingItemContainer(state)
        const resolvedTitleStyle = theme.components.listItem.action.titleText(state, titleStyle)
        const resolvedSubtitleStyle = theme.components.listItem.action.descriptionText(state, subtitleStyle)
        const resolvedIconStyle = theme.components.listItem.action.icon(state)

        return (
          <Fragment>
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
          </Fragment>
        )
      }}
    </Pressable>
  )
}
