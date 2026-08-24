import { forwardRef, useMemo, useState } from 'react'
import {
  Pressable,
  View,
  type PressableProps
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import type { ComponentSize, ButtonVariant } from '@helpwave/hightide-design/semantic-token-resolvers'

import { ContentThemeOverrideProvider } from '../../global-contexts/content-theme/ContentThemeProvider'
import { useDebugContext } from '../../global-contexts/debug'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type { IconComponent, IconStyle } from '../../icons/types'
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
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'

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
  style?: StyleOverwrite<ButtonState, ButtonStyle>,
  stateLayerStyle?: StyleOverwrite<ButtonState, ButtonStyle>,
  textStyle?: StyleOverwrite<ButtonState, ButtonTextStyle>,
  iconStyle?: StyleOverwrite<ButtonState, IconStyle>,
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
  stateLayerStyle,
  textStyle,
  iconStyle,
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

  const [isPressed, setIsPressed] = useState(false)
  const resolvedState = useMemo(() => ({
    size,
    color,
    variant,
    isDisabled: !!disabled,
    isPressed: isPressed,
  }), [color, disabled, isPressed, size, variant])

  const resolvedContainerStyle = useMemoizedTheme(theme.components.button.container, resolvedState, style)
  const resolvedTextStyle = useMemoizedTheme(theme.components.button.text, resolvedState, textStyle)
  const resolvedIcon = useMemoizedTheme(theme.components.button.icon, resolvedState, iconStyle)
  const resolvedStateLayerStyle = useMemoizedTheme(theme.components.button.stateLayer, resolvedState, stateLayerStyle)

  return (
    <Pressable
      {...props}
      ref={ref}
      disabled={disabled}
      hitSlop={hitSlop}
      onLayout={onLayout}
      style={resolvedContainerStyle}
      onPressIn={(event) => {
        setIsPressed(true)
        props.onPressIn?.(event)
      }}
      onPressOut={(event) => {
        setIsPressed(false)
        props.onPressOut?.(event)
      }}
    >
      {hitBox.isVisualizing && (
        <View
          pointerEvents="none"
          style={createHitBoxOverlayStyle(hitSlop, hitBox.color)}
        />
      )}
      <View
        pointerEvents="none"
        style={resolvedStateLayerStyle}
      />
      <ContentThemeOverrideProvider
        foreground={resolvedTextStyle?.color}
        background={resolvedContainerStyle?.backgroundColor}
        textStyle={resolvedTextStyle}
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
    </Pressable>
  )
})
