import type { ReactNode } from 'react'
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { ThemedText } from '../visualization-and-display/ThemedText'
import type {
  ChatQuickReplyChipState,
  ChatQuickReplyChipStyle,
  ChatQuickReplyChipTextStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type ChatQuickReplyChipProps = Omit<PressableProps, 'children' | 'style'> & {
  isActive?: boolean,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  chipStyle?: StyleOverwrite<ChatQuickReplyChipState, ChatQuickReplyChipStyle>,
  textStyle?: StyleOverwrite<ChatQuickReplyChipState, ChatQuickReplyChipTextStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
  focusVisible?: boolean,
}

export const ChatQuickReplyChip = ({
  isActive = false,
  children,
  disabled,
  style,
  chipStyle,
  textStyle,
  ...props
}: ChatQuickReplyChipProps) => {
  const { theme } = useTheme()

  const resolveState = (interaction: PressableInteraction): ChatQuickReplyChipState => ({
    isActive,
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
        return [theme.components.chat.quickReplyChip.container(state, chipStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedText = theme.components.chat.quickReplyChip.text(state, textStyle)

        if (typeof children === 'string' || typeof children === 'number') {
          return <ThemedText style={resolvedText}>{children}</ThemedText>
        }

        return children
      }}
    </Pressable>
  )
}
