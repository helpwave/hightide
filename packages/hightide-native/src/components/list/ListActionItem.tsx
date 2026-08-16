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
import { ThemedText } from '../visualization-and-display/ThemedText'
import type {
  ListActionItemState,
  ListActionItemStyle,
  ListActionItemTitleStyle
} from '../../theme/types/components/listItem'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type ListActionItemProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string,
  leading?: ReactNode,
  trailing?: ReactNode,
  color?: ColorPairToken,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<ListActionItemState, ListActionItemStyle>,
  labelStyle?: StyleOverwrite<ListActionItemState, ListActionItemTitleStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
  focusVisible?: boolean,
}

export const ListActionItem = ({
  label,
  leading,
  trailing,
  color,
  disabled,
  style,
  itemStyle,
  labelStyle,
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
        const resolvedLabelStyle = theme.components.listItem.action.titleText(state, labelStyle)

        return (
          <Fragment>
            {leading != null && (
              <View style={resolvedLeadingItemContainerStyle}>
                {leading}
              </View>
            )}
            <View style={resolvedContentStyle}>
              <ThemedText style={resolvedLabelStyle}>{label}</ThemedText>
            </View>
            {trailing != null && (
              <View style={resolvedTrailingItemContainerStyle}>
                {trailing}
              </View>
            )}
          </Fragment>
        )
      }}
    </Pressable>
  )
}
