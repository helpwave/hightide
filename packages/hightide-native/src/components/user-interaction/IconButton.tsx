import { forwardRef, useMemo } from 'react'
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
import type { PressableInteractionState } from '../../utils/pressableInteraction'
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

type IconButtonContentProps = {
  pressableState: PressableInteractionState,
  icon: IconComponent,
  size: IconButtonSize,
  color?: ColorPairToken,
  variant: IconButtonVariant,
  disabled?: boolean,
  style?: StyleOverwrite<IconButtonState, IconButtonStyle>,
  stateLayerStyle?: StyleOverwrite<IconButtonState, IconButtonStyle>,
  iconStyle?: StyleOverwrite<IconButtonState, IconStyle>,
  hitSlop: PressableProps['hitSlop'],
}

const IconButtonContent = ({
  pressableState,
  icon: IconComponent,
  size,
  color,
  variant,
  disabled,
  style,
  stateLayerStyle,
  iconStyle,
  hitSlop,
}: IconButtonContentProps) => {
  const { theme } = useTheme()
  const { hitBox } = useDebugContext()

  const state = useMemo((): IconButtonState => ({
    size,
    color,
    variant,
    isDisabled: !!disabled,
    isPressed: pressableState.pressed,
    isHovered: !!pressableState.hovered,
    isFocused: !!pressableState.focused,
    isFocusVisible: !!pressableState.focusVisible,
  }), [
    size,
    color,
    variant,
    disabled,
    pressableState.pressed,
    pressableState.hovered,
    pressableState.focused,
    pressableState.focusVisible,
  ])

  const resolvedContainerStyle = useMemoizedTheme(theme.components.iconButton.container, state, style)
  const resolvedStateLayerStyle = useMemoizedTheme(theme.components.iconButton.stateLayer, state, stateLayerStyle)
  const resolvedIconStyle = useMemoizedTheme(theme.components.iconButton.icon, state, iconStyle)

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
        iconStyle={resolvedIconStyle}
      >
        <ThemedIcon icon={IconComponent} />
      </ContentThemeOverrideProvider>
    </View>
  )
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
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={hitSlop}
      onLayout={onLayout}
    >
      {(pressableState) => (
        <IconButtonContent
          pressableState={pressableState as PressableInteractionState}
          icon={icon}
          size={size}
          color={color}
          variant={variant}
          disabled={disabled ?? false}
          style={style}
          stateLayerStyle={stateLayerStyle}
          iconStyle={iconStyle}
          hitSlop={hitSlop}
        />
      )}
    </Pressable>
  )
})
