import {
  Fragment,
  useMemo,
  type ReactNode
} from 'react'
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { ThemedText } from '../visualization-and-display/ThemedText'
import type {
  CardActionItemLabelStyle,
  CardActionItemState,
  CardActionItemStyle
} from '../../theme/types/components/card'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type CardActionItemProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string,
  leading?: ReactNode,
  trailing?: ReactNode,
  danger?: boolean,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<CardActionItemState, CardActionItemStyle>,
  labelStyle?: StyleOverwrite<CardActionItemState, CardActionItemLabelStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
}

export const CardActionItem = ({
  label,
  leading,
  trailing,
  danger = false,
  disabled,
  style,
  itemStyle,
  labelStyle,
  ...props
}: CardActionItemProps) => {
  const { theme } = useTheme()

  const resolveState = (interaction: PressableInteraction): CardActionItemState => ({
    isDanger: danger,
    isDisabled: !!disabled,
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
  })

  const resolvedContentStyle = useMemo(
    () => theme.components.card.actionItemContent({}),
    [theme]
  )

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return [theme.components.card.actionItem(state, itemStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedLabelStyle = theme.components.card.actionItemLabel(state, labelStyle)

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
