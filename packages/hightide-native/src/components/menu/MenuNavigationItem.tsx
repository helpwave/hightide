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
import { ChevronRight } from 'lucide-react-native'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  MenuActionItemLabelStyle,
  MenuActionItemState,
  MenuActionItemStyle
} from '../../theme/types/components/menu'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type MenuNavigationItemProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string,
  leading?: ReactNode,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<MenuActionItemState, MenuActionItemStyle>,
  labelStyle?: StyleOverwrite<MenuActionItemState, MenuActionItemLabelStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
}

export const MenuNavigationItem = ({
  label,
  leading,
  disabled,
  style,
  itemStyle,
  labelStyle,
  ...props
}: MenuNavigationItemProps) => {
  const { theme } = useTheme()

  const resolveState = (interaction: PressableInteraction): MenuActionItemState => ({
    isDisabled: !!disabled,
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
  })

  const resolvedContentStyle = useMemo(
    () => theme.components.menu.navigationItemContent({}),
    [theme]
  )
  const trailingColor = useMemo(
    () => theme.components.menu.navigationItemTrailing({}).color,
    [theme]
  )

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return [theme.components.menu.navigationItem(state, itemStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedLabelStyle = theme.components.menu.navigationItemLabel(state, labelStyle)

        return (
          <Fragment>
            {leading}
            <View style={resolvedContentStyle}>
              <Text style={resolvedLabelStyle}>{label}</Text>
            </View>
            <ChevronRight size={16} color={trailingColor} />
          </Fragment>
        )
      }}
    </Pressable>
  )
}
