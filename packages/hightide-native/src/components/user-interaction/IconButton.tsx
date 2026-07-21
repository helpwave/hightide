import {
  type ButtonColoringStyle,
  type ColoringType,
  type ElementSize
} from '@helpwave/hightide-design'
import type { LucideIcon } from 'lucide-react-native'
import { forwardRef, type ReactNode } from 'react'
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'
import { Icon } from '../../icons/Icon'
import { useTheme } from '../../global-contexts/theme'
import type { IconButtonState, IconButtonStyle, StyleOverwrite } from '../../theme'

export type IconButtonSize = ElementSize

export type IconButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  size?: IconButtonSize,
  color?: ColoringType,
  coloringStyle?: ButtonColoringStyle,
  icon?: LucideIcon,
  iconSize?: ElementSize,
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
  coloringStyle = 'solid',
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
          return <Icon icon={icon} size={iconSize ?? size} color={resolvedIcon.color} />
        }
        return children
      }}
    </Pressable>
  )
})
