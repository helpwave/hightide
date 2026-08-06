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

import type {
  ListItemAppearance,
  ListPositionToken
} from '@helpwave/hightide-design/component-token-resolvers'
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
  position?: ListPositionToken,
  appearance?: ListItemAppearance,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<ListActionItemState, ListActionItemStyle>,
  labelStyle?: StyleOverwrite<ListActionItemState, ListActionItemTitleStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
}

export const ListActionItem = ({
  label,
  leading,
  trailing,
  color,
  position,
  appearance,
  disabled,
  style,
  itemStyle,
  labelStyle,
  ...props
}: ListActionItemProps) => {
  const { theme } = useTheme()

  const resolveState = (interaction: PressableInteraction): ListActionItemState => ({
    color,
    position,
    appearance,
    isDisabled: !!disabled,
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
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
        const resolvedContentStyle = theme.components.listItem.action.content(state)
        const resolvedLabelStyle = theme.components.listItem.action.titleText(state, labelStyle)

        return (
          <Fragment>
            {leading}
            <View style={resolvedContentStyle}>
              <ThemedText style={resolvedLabelStyle}>{label}</ThemedText>
            </View>
            {trailing}
          </Fragment>
        )
      }}
    </Pressable>
  )
}
