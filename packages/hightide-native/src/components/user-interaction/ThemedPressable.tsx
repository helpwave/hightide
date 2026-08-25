import { forwardRef, useMemo, useState } from 'react'
import {
  Pressable,
  View,
  type PressableProps
} from 'react-native'

import type {
  ColoringColorVariant,
  ColoringStyle,
  ComponentSize
} from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import { ContentThemeOverrideProvider } from '../../global-contexts/content-theme/ContentThemeProvider'
import { useDebugContext } from '../../global-contexts/debug'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type {
  ThemedPressableIconStyle,
  ThemedPressableState,
  ThemedPressableStyle,
  ThemedPressableTextStyle
} from '../../theme/types/components/themedPressable'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { createHitBoxOverlayStyle } from '../../utils/hitBoxOverlay'
import { useMinimumTouchTargetHitSlop } from '../../utils/minimumTouchTargetHitSlop'

export type ThemedPressableSize = ComponentSize

export const ThemedPressableUtil = {
  sizes: ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies readonly ComponentSize[],
  coloringStyles: ['filled', 'foreground'] as const satisfies readonly ColoringStyle[],
  coloringColorVariants: ['normal', 'tonal', 'transparent'] as const satisfies readonly ColoringColorVariant[],
}

export type ThemedPressableProps = Omit<PressableProps, 'style'> & {
  size?: ThemedPressableSize,
  color?: ColorPairToken,
  coloringStyle?: ColoringStyle,
  coloringColorVariant?: ColoringColorVariant,
  hasAdditionalHorizontalPadding?: boolean,
  style?: StyleOverwrite<ThemedPressableState, ThemedPressableStyle>,
  stateLayerStyle?: StyleOverwrite<ThemedPressableState, ThemedPressableStyle>,
  iconStyle?: StyleOverwrite<ThemedPressableState, ThemedPressableIconStyle>,
  textStyle?: StyleOverwrite<ThemedPressableState, ThemedPressableTextStyle>,
}

export const ThemedPressable = forwardRef<React.ComponentRef<typeof Pressable>, ThemedPressableProps>(function ThemedPressable({
  children,
  size = 'md',
  color,
  coloringStyle = 'foreground',
  coloringColorVariant = 'normal',
  hasAdditionalHorizontalPadding = false,
  disabled,
  style,
  stateLayerStyle,
  iconStyle,
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
  const [isPressed, setIsPressed] = useState(false)

  const resolvedState = useMemo((): ThemedPressableState => ({
    size,
    color,
    coloringStyle,
    coloringColorVariant,
    hasAdditionalHorizontalPadding,
    isDisabled: !!disabled,
    isPressed,
  }), [
    size,
    color,
    coloringStyle,
    coloringColorVariant,
    hasAdditionalHorizontalPadding,
    disabled,
    isPressed,
  ])

  const resolvedContainerStyle = useMemoizedTheme(theme.components.themedPressable.container, resolvedState, style)
  const resolvedStateLayerStyle = useMemoizedTheme(theme.components.themedPressable.stateLayer, resolvedState, stateLayerStyle)
  const resolvedTextStyle = useMemoizedTheme(theme.components.themedPressable.text, resolvedState, textStyle)
  const resolvedIconStyle = useMemoizedTheme(theme.components.themedPressable.icon, resolvedState, iconStyle)
  const resolvedChildren = typeof children === 'function'
    ? children({ pressed: isPressed })
    : children

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
        foreground={resolvedTextStyle.color}
        background={resolvedContainerStyle.backgroundColor}
        textStyle={resolvedTextStyle}
        iconStyle={resolvedIconStyle}
      >
        {resolvedChildren}
      </ContentThemeOverrideProvider>
    </Pressable>
  )
})
