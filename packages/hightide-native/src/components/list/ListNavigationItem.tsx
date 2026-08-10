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

import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { ThemedText } from '../visualization-and-display/ThemedText'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  ListNavigationItemState,
  ListNavigationItemStyle,
  ListNavigationItemTitleStyle
} from '../../theme/types/components/listItem'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type ListNavigationItemProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string,
  leading?: ReactNode,
  color?: ColorPairToken,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<ListNavigationItemState, ListNavigationItemStyle>,
  labelStyle?: StyleOverwrite<ListNavigationItemState, ListNavigationItemTitleStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
  focusVisible?: boolean,
}

export const ListNavigationItem = ({
  label,
  leading,
  color,
  disabled,
  style,
  itemStyle,
  labelStyle,
  ...props
}: ListNavigationItemProps) => {
  const { theme } = useTheme()

  const resolveState = (interaction: PressableInteraction): ListNavigationItemState => ({
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
        return [theme.components.listItem.navigation.container(state, itemStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedContentStyle = theme.components.listItem.navigation.content(state)
        const resolvedLabelStyle = theme.components.listItem.navigation.titleText(state, labelStyle)
        const resolvedIcon = theme.components.listItem.navigation.icon(state)

        return (
          <Fragment>
            {leading}
            <View style={resolvedContentStyle}>
              <ThemedText style={resolvedLabelStyle}>{label}</ThemedText>
            </View>
            <ThemedIcon
              icon={HightideIconRegistry.ChevronRight}
              size={resolvedIcon.size}
              color={resolvedIcon.color}
            />
          </Fragment>
        )
      }}
    </Pressable>
  )
}
