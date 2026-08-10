import {
  forwardRef,
  type ReactNode
} from 'react'
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import type { ComponentSize, PressableVariant } from '@helpwave/hightide-design/semantic-token-resolvers'

import { ContentThemeProvider } from '../../global-contexts/content-theme/ContentThemeProvider'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  ButtonState,
  ButtonStyle,
  ButtonTextStyle
} from '../../theme/types/components/button'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { ThemedText } from '../visualization-and-display/ThemedText'
import type { Color } from '../../theme/types/color'

export type ButtonSize = ComponentSize

export type ButtonColor = ColorPairToken

export const ButtonUtil = {
  sizes: ['sm', 'md', 'lg'] as const satisfies readonly ComponentSize[],
  variants: ['elevated', 'filled', 'tonal', 'outlined', 'foreground'] as const satisfies readonly PressableVariant[],
}

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  size?: ButtonSize,
  color?: ButtonColor,
  variant?: PressableVariant,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  touchTargetStyle?: StyleOverwrite<ButtonState, ButtonStyle>,
  visualContainerStyle?: StyleOverwrite<ButtonState, ButtonStyle>,
  stateLayerStyle?: StyleOverwrite<ButtonState, ButtonStyle>,
  textStyle?: StyleOverwrite<ButtonState, ButtonTextStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
  focusVisible?: boolean,
}

export const Button = forwardRef<React.ComponentRef<typeof Pressable>, ButtonProps>(function Button({
  children,
  size = 'md',
  color,
  variant = 'filled',
  disabled,
  style,
  touchTargetStyle,
  visualContainerStyle,
  stateLayerStyle,
  textStyle,
  ...props
}, ref) {
  const { theme } = useTheme()

  const resolveState = (interaction: PressableInteraction): ButtonState => ({
    size,
    color,
    variant,
    isDisabled: !!disabled,
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
    isFocusVisible: !!interaction.focusVisible,
  })

  return (
    <Pressable
      {...props}
      ref={ref}
      disabled={disabled}
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return [theme.components.button.touchTarget(state, touchTargetStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedText = theme.components.button.text(state, textStyle)

        return (
          <View style={theme.components.button.visualContainer(state, visualContainerStyle)}>
            <View
              pointerEvents="none"
              style={theme.components.button.stateLayer(state, stateLayerStyle)}
            />
            <ContentThemeProvider
              foregroundColor={resolvedText.color as Color}
              textStyle={resolvedText}
            >
              {typeof children === 'string' || typeof children === 'number'
                ? <ThemedText>{children}</ThemedText>
                : children}
            </ContentThemeProvider>
          </View>
        )
      }}
    </Pressable>
  )
})
