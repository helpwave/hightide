import type { ReactNode } from 'react'
import {
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from 'react-native'
import { useTheme } from '../../global-contexts/theme'
import type {
  ChatQuickReplyChipStyle,
  ChatQuickReplyChipTextStyle
} from '../../theme'

export type ChatQuickReplyChipProps = Omit<PressableProps, 'children' | 'style'> & {
  isActive?: boolean,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  chipStyle?: StyleProp<ViewStyle> | ((style: ChatQuickReplyChipStyle) => StyleProp<ViewStyle>),
  textStyle?: StyleProp<TextStyle> | ((style: ChatQuickReplyChipTextStyle) => StyleProp<TextStyle>),
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

  const resolveStyles = (interaction: PressableInteraction) => {
    const state = {
      isActive,
      isDisabled: !!disabled,
      isPressed: interaction.pressed,
      isHovered: !!interaction.hovered,
      isFocused: !!interaction.focused,
    }

    const resolvedChip = theme.components.chat.quickReplyChip(state)
    const resolvedText = theme.components.chat.quickReplyChipText(state)

    return {
      chip: typeof chipStyle === 'function' ? chipStyle(resolvedChip) : [resolvedChip, chipStyle],
      text: typeof textStyle === 'function' ? textStyle(resolvedText) : [resolvedText, textStyle],
    }
  }

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={(pressableState) => {
        const resolved = resolveStyles(pressableState as PressableInteraction)
        return [resolved.chip, style]
      }}
    >
      {(pressableState) => {
        const resolved = resolveStyles(pressableState as PressableInteraction)

        if (typeof children === 'string' || typeof children === 'number') {
          return <Text style={resolved.text}>{children}</Text>
        }

        return children
      }}
    </Pressable>
  )
}
