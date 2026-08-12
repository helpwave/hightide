import { forwardRef, type ReactNode } from 'react'
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'

import type {
  ColoringColorVariant,
  ColoringStyle,
  ComponentSize
} from '@helpwave/hightide-design/semantic-token-resolvers'
import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import { ContentThemeProvider } from '../../global-contexts/content-theme/ContentThemeProvider'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  ThemedPressableState,
  ThemedPressableStyle,
  ThemedPressableTextStyle
} from '../../theme/types/components/themedPressable'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type ThemedPressableSize = ComponentSize

export const ThemedPressableUtil = {
  sizes: ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies readonly ComponentSize[],
  coloringStyles: ['filled', 'foreground'] as const satisfies readonly ColoringStyle[],
  coloringColorVariants: ['normal', 'tonal', 'transparent'] as const satisfies readonly ColoringColorVariant[],
}

export type ThemedPressableProps = Omit<PressableProps, 'children' | 'style'> & {
  size?: ThemedPressableSize,
  color?: ColorPairToken,
  coloringStyle?: ColoringStyle,
  coloringColorVariant?: ColoringColorVariant,
  hasAdditionalHorizontalPadding?: boolean,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  touchTargetStyle?: StyleOverwrite<ThemedPressableState, ThemedPressableStyle>,
  visualContainerStyle?: StyleOverwrite<ThemedPressableState, ThemedPressableStyle>,
  stateLayerStyle?: StyleOverwrite<ThemedPressableState, ThemedPressableStyle>,
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
  touchTargetStyle,
  visualContainerStyle,
  stateLayerStyle,
  textStyle,
  ...props
}, ref) {
  const { theme } = useTheme()

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
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return [theme.components.themedPressable.touchTarget(state, touchTargetStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedText = theme.components.themedPressable.text(state, textStyle)

        return (
          <View style={theme.components.themedPressable.visualContainer(state, visualContainerStyle)}>
            <View
              pointerEvents="none"
              style={theme.components.themedPressable.stateLayer(state, stateLayerStyle)}
            />
            <ContentThemeProvider
              foregroundColor={resolvedText.color ?? theme.colors.surface.onColor}
              textStyle={resolvedText}
            >
              {children}
            </ContentThemeProvider>
          </View>
        )
      }}
    </Pressable>
  )
})
