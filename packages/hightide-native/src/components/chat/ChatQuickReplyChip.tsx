import type { ReactNode } from 'react'
import {
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import { useTheme } from '@/src/global-contexts/theme/ThemeContext'
import type {
  ChatQuickReplyChipState,
  ChatQuickReplyChipStyle,
  ChatQuickReplyChipTextStyle
} from '@/src/theme/types/components/chat'
import type { StyleOverwrite } from '@/src/theme/types/resolver'

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
          return <Text style={resolvedText}>{children}</Text>
        }

        return children
      }}
    </Pressable>
  )
}
