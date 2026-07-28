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
  CardActionItemLabelStyle,
  CardActionItemState,
  CardActionItemStyle
} from '../../theme/types/components/card'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type CardNavigationItemProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string,
  leading?: ReactNode,
  style?: StyleProp<ViewStyle>,
  itemStyle?: StyleOverwrite<CardActionItemState, CardActionItemStyle>,
  labelStyle?: StyleOverwrite<CardActionItemState, CardActionItemLabelStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
}

export const CardNavigationItem = ({
  label,
  leading,
  disabled,
  style,
  itemStyle,
  labelStyle,
  ...props
}: CardNavigationItemProps) => {
  const { theme } = useTheme()

  const resolveState = (interaction: PressableInteraction): CardActionItemState => ({
    isDisabled: !!disabled,
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
  })

  const resolvedContentStyle = useMemo(
    () => theme.components.card.navigationItemContent({}),
    [theme]
  )
  const trailingColor = useMemo(
    () => theme.components.card.navigationItemTrailing({}).color,
    [theme]
  )

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return [theme.components.card.navigationItem(state, itemStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedLabelStyle = theme.components.card.navigationItemLabel(state, labelStyle)

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
