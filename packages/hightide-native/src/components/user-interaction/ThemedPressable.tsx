import { forwardRef, useMemo } from 'react'
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
import type { PressableInteractionState } from '../../utils/pressableInteraction'

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

type PressableInteraction = PressableInteractionState

type ThemedPressableContentProps = {
  pressableState: PressableInteraction,
  children: ThemedPressableProps['children'],
  size: ThemedPressableSize,
  color?: ColorPairToken,
  coloringStyle: ColoringStyle,
  coloringColorVariant: ColoringColorVariant,
  hasAdditionalHorizontalPadding: boolean,
  disabled?: boolean,
  style?: StyleOverwrite<ThemedPressableState, ThemedPressableStyle>,
  stateLayerStyle?: StyleOverwrite<ThemedPressableState, ThemedPressableStyle>,
  iconStyle?: StyleOverwrite<ThemedPressableState, ThemedPressableIconStyle>,
  textStyle?: StyleOverwrite<ThemedPressableState, ThemedPressableTextStyle>,
  hitSlop: PressableProps['hitSlop'],
}

const ThemedPressableContent = ({
  pressableState,
  children,
  size,
  color,
  coloringStyle,
  coloringColorVariant,
  hasAdditionalHorizontalPadding,
  disabled,
  style,
  stateLayerStyle,
  iconStyle,
  textStyle,
  hitSlop,
}: ThemedPressableContentProps) => {
  const { theme } = useTheme()
  const { hitBox } = useDebugContext()

  const state = useMemo((): ThemedPressableState => ({
    size,
    color,
    coloringStyle,
    coloringColorVariant,
    hasAdditionalHorizontalPadding,
    isDisabled: !!disabled,
    isPressed: pressableState.pressed,
    isHovered: !!pressableState.hovered,
    isFocused: !!pressableState.focused,
    isFocusVisible: !!pressableState.focusVisible,
  }), [
    size,
    color,
    coloringStyle,
    coloringColorVariant,
    hasAdditionalHorizontalPadding,
    disabled,
    pressableState.pressed,
    pressableState.hovered,
    pressableState.focused,
    pressableState.focusVisible,
  ])

  const resolvedContainerStyle = useMemoizedTheme(theme.components.themedPressable.container, state, style)
  const resolvedStateLayerStyle = useMemoizedTheme(theme.components.themedPressable.stateLayer, state, stateLayerStyle)
  const resolvedTextStyle = useMemoizedTheme(theme.components.themedPressable.text, state, textStyle)
  const resolvedIconStyle = useMemoizedTheme(theme.components.themedPressable.icon, state, iconStyle)
  const resolvedChildren = typeof children === 'function'
    ? children(pressableState)
    : children

  return (
    <View style={resolvedContainerStyle}>
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
    </View>
  )
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
  const { hitSlop, onLayout } = useMinimumTouchTargetHitSlop({
    touchTargetSize: theme.semantics.touchTargetSize({}),
    hitSlop: providedHitSlop,
    onLayout: providedOnLayout,
  })

  return (
    <Pressable
      {...props}
      ref={ref}
      disabled={disabled}
      hitSlop={hitSlop}
      onLayout={onLayout}
    >
      {(pressableState) => (
        <ThemedPressableContent
          pressableState={pressableState as PressableInteractionState}
          size={size}
          color={color}
          coloringStyle={coloringStyle}
          coloringColorVariant={coloringColorVariant}
          hasAdditionalHorizontalPadding={hasAdditionalHorizontalPadding}
          disabled={disabled ?? false}
          style={style}
          stateLayerStyle={stateLayerStyle}
          iconStyle={iconStyle}
          textStyle={textStyle}
          hitSlop={hitSlop}
        >
          {children}
        </ThemedPressableContent>
      )}
    </Pressable>
  )
})
