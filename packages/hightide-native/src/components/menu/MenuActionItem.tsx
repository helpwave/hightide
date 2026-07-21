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

export type MenuActionItemProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string,
  leading?: ReactNode,
  trailing?: ReactNode,
  danger?: boolean,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleProp<ViewStyle> | ((style: MenuActionItemStyle) => StyleProp<ViewStyle>),
  labelStyle?: StyleProp<TextStyle> | ((style: MenuActionItemLabelStyle) => StyleProp<TextStyle>),
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

  const resolveStyles = (interaction: PressableInteraction) => {
    const state = {
      isDanger: danger,
      isDisabled: !!disabled,
      isPressed: interaction.pressed,
      isHovered: !!interaction.hovered,
      isFocused: !!interaction.focused,
    }

    const resolvedItem = theme.components.menu.actionItem(state)
    const resolvedContent = theme.components.menu.actionItemContent({})
    const resolvedLabel = theme.components.menu.actionItemLabel(state)

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
            {trailing}
          </Fragment>
        )
      }}
    </Pressable>
  )
}
