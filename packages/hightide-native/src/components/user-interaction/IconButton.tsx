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
import type { ComponentSize, ComponentSizeBasic } from '@helpwave/hightide-design/theme-tokens'
import type {
  ColoringType,
  PressableColoringStyle
} from '@helpwave/hightide-design/semantic-tokens'

import type { IconComponent } from '../../icons/types'
import { Icon } from '../visualization-and-display/Icon'
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
  color?: ColoringType,
  coloringStyle?: IconButtonColoringStyle,
  icon?: IconComponent,
  iconSize?: ComponentSizeBasic,
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
  icon,
  iconSize,
  size = 'md',
  color = 'neutral',
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

        if (icon) {
          return (
            <Icon
              icon={icon}
              size={iconSize ?? (size === 'xs' || size === 'xl' ? 'md' : size)}
              color={resolvedIcon.color}
            />
          )
        }
        return children
      }}
    </Pressable>
  )
})
