import {
  forwardRef,
  type ReactNode
} from 'react'
import {
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import {
  coloringTypes,
  type ColoringType
} from '@helpwave/hightide-design/utils'
import type {
  ButtonColoringStyle,
  ElementSize
} from '@helpwave/hightide-design/types'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  ButtonState,
  ButtonStyle,
  ButtonTextStyle
} from '../../theme/types/components/button'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type ButtonSize = ElementSize

export type ButtonColor = ColoringType

export const ButtonUtil = {
  colors: coloringTypes,
  sizes: ['xs', 'sm', 'md', 'lg'] as const satisfies readonly ElementSize[],
  coloringStyles: ['outline', 'solid', 'text', 'tonal', 'tonal-outline'] as const satisfies readonly ButtonColoringStyle[],
}

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  size?: ButtonSize,
  color?: ButtonColor,
  coloringStyle?: ButtonColoringStyle,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  buttonStyle?: StyleOverwrite<ButtonState, ButtonStyle>,
  textStyle?: StyleOverwrite<ButtonState, ButtonTextStyle>,
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

  const resolveState = (interaction: PressableInteraction): ButtonState => ({
    size,
    color,
    coloringStyle,
    isDisabled: !!disabled,
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
  })

  return (
    <Pressable
      {...props}
      ref={ref}
      disabled={disabled}
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return [theme.components.button.button(state, buttonStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedText = theme.components.button.text(state, textStyle)

        if (typeof children === 'string' || typeof children === 'number') {
          return <Text style={resolvedText}>{children}</Text>
        }

        return children
      }}
    </Pressable>
  )
})
