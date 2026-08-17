import { Fragment, forwardRef } from 'react'
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import type { ComponentSize, ButtonVariant } from '@helpwave/hightide-design/semantic-token-resolvers'

import { ContentThemeOverrideProvider } from '../../global-contexts/content-theme/ContentThemeProvider'
import { useDebugContext } from '../../global-contexts/debug'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type { IconComponent } from '../../icons/types'
import type {
  ButtonState,
  ButtonStyle,
  ButtonTextStyle
} from '../../theme/types/components/button'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { createHitBoxOverlayStyle } from '../../utils/hitBoxOverlay'
import { useMinimumTouchTargetHitSlop } from '../../utils/minimumTouchTargetHitSlop'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { ThemedText } from '../visualization-and-display/ThemedText'

export type ButtonSize = ComponentSize

export type ButtonColor = ColorPairToken

export const ButtonUtil = {
  sizes: ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies readonly ComponentSize[],
  variants: ['elevated', 'filled', 'tonal', 'outlined', 'foreground'] as const satisfies readonly ButtonVariant[],
}

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  size?: ButtonSize,
  color?: ButtonColor,
  variant?: ButtonVariant,
  children: string,
  leadingIcon?: IconComponent,
  trailingIcon?: IconComponent,
  style?: StyleProp<ViewStyle>,
  containerStyle?: StyleOverwrite<ButtonState, ButtonStyle>,
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
  leadingIcon,
  trailingIcon,
  style,
  containerStyle,
  stateLayerStyle,
  textStyle,
  hitSlop: providedHitSlop,
  onLayout: providedOnLayout,
  ...props
}, ref) {
  const { theme } = useTheme()
  const { hitBox } = useDebugContext()
  const { hitSlop, onLayout } = useMinimumTouchTargetHitSlop({
    touchTargetSize: theme.semantics.touchTargetSize({}),
    hitSlop: providedHitSlop,
    onLayout: providedOnLayout,
  })

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
      hitSlop={hitSlop}
      onLayout={onLayout}
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return [
          theme.components.button.container(state, containerStyle),
          style,
        ]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedText = theme.components.button.text(state, textStyle)
        const resolvedIcon = theme.components.button.icon(state)

        return (
          <Fragment>
            {hitBox.isVisualizing && (
              <View
                pointerEvents="none"
                style={createHitBoxOverlayStyle(hitSlop, hitBox.color)}
              />
            )}
            <View
              pointerEvents="none"
              style={theme.components.button.stateLayer(state, stateLayerStyle)}
            />
            <ContentThemeOverrideProvider
              textStyle={resolvedText}
              iconStyle={resolvedIcon}
            >
              {leadingIcon !== undefined && (
                <ThemedIcon icon={leadingIcon} />
              )}
              <ThemedText>{children}</ThemedText>
              {trailingIcon !== undefined && (
                <ThemedIcon icon={trailingIcon} />
              )}
            </ContentThemeOverrideProvider>
          </Fragment>
        )
      }}
    </Pressable>
  )
})
