import {
  forwardRef,
  type ReactNode
} from 'react'
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import type {
  ColorPairToken,
  ComponentSize,
  PressableColoringStyle
} from '@helpwave/hightide-design/theme-tokens'

import { ContentThemeProvider } from '../../global-contexts/content-theme/ContentThemeProvider'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  IconButtonState,
  IconButtonStyle
} from '../../theme/types/components/iconButton'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type IconButtonSize = ComponentSize

export type IconButtonColoringStyle = PressableColoringStyle

export type IconButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  size?: IconButtonSize,
  color?: ColorPairToken,
  coloringStyle?: IconButtonColoringStyle,
  children?: ReactNode,
  accessibilityLabel: string,
  style?: StyleProp<ViewStyle>,
  buttonStyle?: StyleOverwrite<IconButtonState, IconButtonStyle>,
}

type PressableInteraction = {
  pressed: boolean,
  hovered?: boolean,
  focused?: boolean,
}

export const IconButton = forwardRef<React.ComponentRef<typeof Pressable>, IconButtonProps>(function IconButton({
  children,
  size = 'md',
  color,
  coloringStyle = 'filled',
  disabled,
  accessibilityLabel,
  style,
  buttonStyle,
  ...props
}, ref) {
  const { theme } = useTheme()

  const resolveState = (interaction: PressableInteraction): IconButtonState => ({
    size,
    color,
    coloringStyle,
    isDisabled: !!disabled,
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
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
        return [theme.components.iconButton.button(state, buttonStyle), style]
      }}
    >
      {(pressableState) => {
        const state = resolveState(pressableState as PressableInteraction)
        const resolvedIcon = theme.components.iconButton.icon(state)
        const resolvedText = theme.components.iconButton.text(state)

        return (
          <ContentThemeProvider
            foregroundColor={resolvedIcon.color}
            textStyle={resolvedText}
          >
            {children}
          </ContentThemeProvider>
        )
      }}
    </Pressable>
  )
})
