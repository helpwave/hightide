import { Fragment, forwardRef } from 'react'
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

export type ThemedPressableProps = PressableProps & {
  size?: ThemedPressableSize,
  color?: ColorPairToken,
  coloringStyle?: ColoringStyle,
  coloringColorVariant?: ColoringColorVariant,
  hasAdditionalHorizontalPadding?: boolean,
  containerStyle?: StyleOverwrite<ThemedPressableState, ThemedPressableStyle>,
  stateLayerStyle?: StyleOverwrite<ThemedPressableState, ThemedPressableStyle>,
  iconStyle?: StyleOverwrite<ThemedPressableState, ThemedPressableIconStyle>,
  textStyle?: StyleOverwrite<ThemedPressableState, ThemedPressableTextStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
  focusVisible?: boolean,
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
  containerStyle,
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

  const resolveState = (interaction: PressableInteraction): ThemedPressableState => ({
    size,
    color,
    coloringStyle,
    coloringColorVariant,
    hasAdditionalHorizontalPadding,
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
        const resolvedStyle = typeof style === 'function' ? style(pressableState) : style
        return [
          theme.components.themedPressable.container(state, containerStyle),
          resolvedStyle,
        ]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedText = theme.components.themedPressable.text(state, textStyle)
        const resolvedIcon = theme.components.themedPressable.icon(state, iconStyle)
        const resolvedChildren = typeof children === 'function'
          ? children(pressableState)
          : children

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
              style={theme.components.themedPressable.stateLayer(state, stateLayerStyle)}
            />
            <ContentThemeOverrideProvider
              foreground={resolvedText.color}
              textStyle={resolvedText}
              iconStyle={resolvedIcon}
            >
              {resolvedChildren}
            </ContentThemeOverrideProvider>
          </Fragment>
        )
      }}
    </Pressable>
  )
})
