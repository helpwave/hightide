import { ChevronRight } from 'lucide-react-native'
import { Fragment, type ReactNode } from 'react'
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from 'react-native'
import { useTheme } from '../../global-contexts/theme'
import type {
  MenuActionItemLabelStyle,
  MenuActionItemStyle
} from '../../theme'

export type MenuNavigationItemProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string,
  leading?: ReactNode,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleProp<ViewStyle> | ((style: MenuActionItemStyle) => StyleProp<ViewStyle>),
  labelStyle?: StyleProp<TextStyle> | ((style: MenuActionItemLabelStyle) => StyleProp<TextStyle>),
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
  const trailingColor = theme.components.menu.navigationItemTrailing({}).color

  const resolveStyles = (interaction: PressableInteraction) => {
    const state = {
      isDisabled: !!disabled,
      isPressed: interaction.pressed,
      isHovered: !!interaction.hovered,
      isFocused: !!interaction.focused,
    }

    const resolvedItem = theme.components.menu.navigationItem(state)
    const resolvedContent = theme.components.menu.navigationItemContent({})
    const resolvedLabel = theme.components.menu.navigationItemLabel(state)

    return {
      item: typeof itemStyle === 'function' ? itemStyle(resolvedItem) : [resolvedItem, itemStyle],
      content: resolvedContent,
      label: typeof labelStyle === 'function' ? labelStyle(resolvedLabel) : [resolvedLabel, labelStyle],
    }
  }

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={(pressableState) => {
        const resolved = resolveStyles(pressableState as PressableInteraction)
        return [resolved.item, style]
      }}
    >
      {(pressableState) => {
        const resolved = resolveStyles(pressableState as PressableInteraction)

        return (
          <Fragment>
            {leading}
            <View style={resolved.content}>
              <Text style={resolved.label}>{label}</Text>
            </View>
            <ChevronRight size={16} color={trailingColor} />
          </Fragment>
        )
      }}
    </Pressable>
  )
}
