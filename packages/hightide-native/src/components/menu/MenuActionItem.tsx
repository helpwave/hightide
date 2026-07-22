import {
  Fragment,
  useMemo,
  type ReactNode
} from 'react'
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import { useTheme } from '@/src/global-contexts/theme/ThemeContext'
import type {
  MenuActionItemLabelStyle,
  MenuActionItemState,
  MenuActionItemStyle
} from '@/src/theme/types/components/menu'
import type { StyleOverwrite } from '@/src/theme/types/resolver'

export type MenuActionItemProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string,
  leading?: ReactNode,
  trailing?: ReactNode,
  danger?: boolean,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<MenuActionItemState, MenuActionItemStyle>,
  labelStyle?: StyleOverwrite<MenuActionItemState, MenuActionItemLabelStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
}

export const MenuActionItem = ({
  label,
  leading,
  trailing,
  danger = false,
  disabled,
  style,
  itemStyle,
  labelStyle,
  ...props
}: MenuActionItemProps) => {
  const { theme } = useTheme()

  const resolveState = (interaction: PressableInteraction): MenuActionItemState => ({
    isDanger: danger,
    isDisabled: !!disabled,
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
  })

  const resolvedContentStyle = useMemo(
    () => theme.components.menu.actionItemContent({}),
    [theme]
  )

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return [theme.components.menu.actionItem(state, itemStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedLabelStyle = theme.components.menu.actionItemLabel(state, labelStyle)

        return (
          <Fragment>
            {leading}
            <View style={resolvedContentStyle}>
              <Text style={resolvedLabelStyle}>{label}</Text>
            </View>
            {trailing}
          </Fragment>
        )
      }}
    </Pressable>
  )
}
