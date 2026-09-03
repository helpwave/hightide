import { forwardRef, useMemo, useState } from 'react'
import {
  Pressable,
  View,
  type PressableProps
} from 'react-native'
import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import type {
  ComponentSize,
  IconButtonVariant
} from '@helpwave/hightide-design/semantic-token-resolvers'

import { ContentThemeOverrideProvider } from '../../global-contexts/content-theme/ContentThemeProvider'
import { useDebugContext } from '../../global-contexts/debug'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type {
  IconButtonState,
  IconButtonStyle
} from '../../theme/types/components/iconButton'
import type { StyleOverwrite } from '../../theme/types/resolver'
import type { IconComponent, IconStyle } from '../../icons'
import { createHitBoxOverlayStyle } from '../../utils/hitBoxOverlay'
import { useMinimumTouchTargetHitSlop } from '../../utils/minimumTouchTargetHitSlop'
import { ThemedIcon, ThemedLoadingSpinner } from '../visualization-and-display'

export type IconButtonSize = ComponentSize

export type { IconButtonVariant }

export const IconButtonUtil = {
  sizes: ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies readonly ComponentSize[],
  variants: ['elevated', 'filled', 'tonal', 'foreground'] as const satisfies readonly IconButtonVariant[],
}

export type IconButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  size?: IconButtonSize,
  color?: ColorPairToken,
  variant?: IconButtonVariant,
  icon: IconComponent,
  accessibilityLabel: string,
  style?: StyleOverwrite<IconButtonState, IconButtonStyle>,
  stateLayerStyle?: StyleOverwrite<IconButtonState, IconButtonStyle>,
  iconStyle?:  StyleOverwrite<IconButtonState, IconStyle>,
  isProcessing?: boolean,
}

export const IconButton = forwardRef<React.ComponentRef<typeof Pressable>, IconButtonProps>(function IconButton({
  icon,
  size = 'md',
  color,
  variant = 'filled',
  disabled,
  accessibilityLabel,
  style,
  stateLayerStyle,
  iconStyle,
  isProcessing = false,
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

  const resolvedState = useMemo((): IconButtonState => ({
    size,
    color,
    variant,
    isDisabled: !!disabled,
    isPressed,
  }), [
    size,
    color,
    variant,
    disabled,
    isPressed,
  ])

  const resolvedContainerStyle = useMemoizedTheme(theme.components.iconButton.container, resolvedState, style)
  const resolvedStateLayerStyle = useMemoizedTheme(theme.components.iconButton.stateLayer, resolvedState, stateLayerStyle)
  const resolvedIconStyle = useMemoizedTheme(theme.components.iconButton.icon, resolvedState, iconStyle)

  return (
    <Pressable
      {...props}
      ref={ref}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{
        disabled: !!disabled,
        busy: isProcessing,
      }}
      hitSlop={hitSlop}
      onLayout={onLayout}
      style={resolvedContainerStyle}
      onPress={(event) => {
        if (isProcessing) {
          return
        }
        props.onPress?.(event)
      }}
      onPressIn={(event) => {
        if (isProcessing) {
          return
        }
        setIsPressed(true)
        props.onPressIn?.(event)
      }}
      onPressOut={(event) => {
        if (isProcessing) {
          return
        }
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
        iconStyle={resolvedIconStyle}
      >
        {isProcessing ? (
          <ThemedLoadingSpinner />
        ) : (
          <ThemedIcon icon={icon} />
        )}
      </ContentThemeOverrideProvider>
    </Pressable>
  )
})
