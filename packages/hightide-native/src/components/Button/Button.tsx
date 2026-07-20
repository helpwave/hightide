import {
  coloringColors,
  type ButtonColoringStyle,
  type ColoringType,
  type ElementSize
} from '@helpwave/hightide-design'
import { forwardRef, type ReactNode } from 'react'
import {
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from 'react-native'
import { useTheme } from '../../global-contexts/theme'
import type { ButtonState, ButtonStyle, ButtonTextStyle } from '../../theme'

export type ButtonSize = ElementSize

export type ButtonColor = ColoringType

export const ButtonUtil = {
  colors: coloringColors,
  sizes: ['xs', 'sm', 'md', 'lg'] as const satisfies readonly ElementSize[],
  coloringStyles: ['outline', 'solid', 'text', 'tonal', 'tonal-outline'] as const satisfies readonly ButtonColoringStyle[],
}

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  size?: ButtonSize,
  color?: ButtonColor,
  coloringStyle?: ButtonColoringStyle,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  buttonStyle?: StyleProp<ViewStyle> | ((style: ButtonStyle) => StyleProp<ViewStyle>),
  textStyle?: StyleProp<TextStyle> | ((style: ButtonTextStyle) => StyleProp<TextStyle>),
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
}

export const Button = forwardRef<React.ComponentRef<typeof Pressable>, ButtonProps>(function Button({
  children,
  size = 'md',
  color = 'primary',
  coloringStyle = 'solid',
  disabled,
  style,
  buttonStyle,
  textStyle,
  ...props
}, ref) {
  const { theme } = useTheme()

  const resolveStyles = (interaction: PressableInteraction) => {
    const state: ButtonState = {
      size,
      color,
      coloringStyle,
      isDisabled: !!disabled,
      isPressed: interaction.pressed,
      isHovered: !!interaction.hovered,
      isFocused: !!interaction.focused,
    }

    const resolvedButton = theme.components.button.button(state)
    const resolvedText = theme.components.button.text(state)

    return {
      button: typeof buttonStyle === 'function' ? buttonStyle(resolvedButton) : [resolvedButton, buttonStyle],
      text: typeof textStyle === 'function' ? textStyle(resolvedText) : [resolvedText, textStyle],
    }
  }

  return (
    <Pressable
      {...props}
      ref={ref}
      disabled={disabled}
      style={(pressableState) => {
        const interaction = pressableState as PressableInteraction
        const resolved = resolveStyles(interaction)

        return [resolved.button, style]
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
})
