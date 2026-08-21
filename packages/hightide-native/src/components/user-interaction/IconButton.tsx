import { Fragment, forwardRef } from 'react'
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
import type {
  IconButtonState,
  IconButtonStyle
} from '../../theme/types/components/iconButton'
import type { StyleOverwrite } from '../../theme/types/resolver'
import type { IconComponent, IconStyle } from '../../icons'
import { createHitBoxOverlayStyle } from '../../utils/hitBoxOverlay'
import { useMinimumTouchTargetHitSlop } from '../../utils/minimumTouchTargetHitSlop'
import { ThemedIcon } from '../visualization-and-display'

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
  stateLayerStyle,
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
      hitSlop={hitSlop}
      onLayout={onLayout}
      style={(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        return theme.components.iconButton.container(state, style)
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedIcon = theme.components.iconButton.icon(state, iconStyle)

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
              style={theme.components.iconButton.stateLayer(state, stateLayerStyle)}
            />
            <ContentThemeOverrideProvider
              iconStyle={resolvedIcon}
            >
              <ThemedIcon icon={IconComponent} />
            </ContentThemeOverrideProvider>
          </Fragment>
        )
      }}
    </Pressable>
  )
})
