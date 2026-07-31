import {
  forwardRef,
  type ReactNode
} from 'react'
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import type { ComponentSize } from '@helpwave/hightide-design/component-tokens'
import {
  colorSchemeTypes,
  type ColoringType,
  type PressableColoringStyle
} from '@helpwave/hightide-design/semantic-tokens'

import { ContentThemeProvider } from '../../global-contexts/content-theme/ContentThemeProvider'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  ButtonState,
  ButtonStyle,
  ButtonTextStyle
} from '../../theme/types/components/button'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { Text } from '../visualization-and-display/Text'
import type { Color } from '../../theme/types/color'

export type ButtonSize = ComponentSize

export type ButtonColor = ColoringType

export const ButtonUtil = {
  colors: colorSchemeTypes,
  sizes: ['sm', 'md', 'lg'] as const satisfies readonly ComponentSize[],
  coloringStyles: ['outline', 'filled', 'text', 'tonal', 'tonal-outline'] as const satisfies readonly PressableColoringStyle[],
}

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  size?: ButtonSize,
  color?: ButtonColor,
  coloringStyle?: PressableColoringStyle,
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
  coloringStyle = 'filled',
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

        return (
          <ContentThemeProvider
            foregroundColor={resolvedText.color as Color}
            textStyle={resolvedText}
          >
            {typeof children === 'string' || typeof children === 'number'
              ? <Text>{children}</Text>
              : children}
          </ContentThemeProvider>
        )
      }}
    </Pressable>
  )
})
