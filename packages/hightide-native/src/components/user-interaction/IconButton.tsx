import { forwardRef } from 'react'
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
  IconButtonState,
  IconButtonStyle
} from '../../theme/types/components/iconButton'
import type { StyleOverwrite } from '../../theme/types/resolver'
import type { IconComponent } from '../../icons'
import { ThemedIcon } from '../visualization-and-display'

export type IconButtonSize = ComponentSize

export type IconButtonVariant = PressableVariant

export type IconButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  size?: IconButtonSize,
  color?: ColorPairToken,
  variant?: IconButtonVariant,
  icon: IconComponent,
  accessibilityLabel: string,
  style?: StyleProp<ViewStyle>,
  touchTargetStyle?: StyleOverwrite<IconButtonState, IconButtonStyle>,
  visualContainerStyle?: StyleOverwrite<IconButtonState, IconButtonStyle>,
  stateLayerStyle?: StyleOverwrite<IconButtonState, IconButtonStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
  focusVisible?: boolean,
}

export const IconButton = forwardRef<React.ComponentRef<typeof Pressable>, IconButtonProps>(function IconButton({
  icon: IconComponent,
  size = 'md',
  color,
  variant = 'filled',
  disabled,
  accessibilityLabel,
  style,
  touchTargetStyle,
  visualContainerStyle,
  stateLayerStyle,
  ...props
}, ref) {
  const { theme } = useTheme()

  const resolveState = (interaction: PressableInteraction): IconButtonState => ({
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
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return [theme.components.iconButton.touchTarget(state, touchTargetStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedIcon = theme.components.iconButton.icon(state)
        const resolvedText = theme.components.iconButton.text(state)

        return (
          <View style={theme.components.iconButton.visualContainer(state, visualContainerStyle)}>
            <View
              pointerEvents="none"
              style={theme.components.iconButton.stateLayer(state, stateLayerStyle)}
            />
            <ContentThemeProvider
              foregroundColor={resolvedIcon.color ?? theme.colors.primary.color}
              textStyle={resolvedText}
            >
              <ThemedIcon icon={IconComponent} size={resolvedIcon.size} strokeWidth={resolvedIcon.strokeWidth}/>
            </ContentThemeProvider>
          </View>
        )
      }}
    </Pressable>
  )
})
