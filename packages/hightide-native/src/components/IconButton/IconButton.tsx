import {
  type ButtonColoringStyle,
  type ColoringColor,
  resolveIconButtonStyles
} from '@helpwave/hightide-design'
import type { ElementSize } from '@helpwave/hightide-design'
import type { LucideIcon } from 'lucide-react-native'
import { forwardRef, type ReactNode } from 'react'
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'
import { Icon } from '../../icons/Icon'
import { useTheme } from '../../global-contexts/theme'

export type IconButtonSize = ElementSize

export type IconButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  size?: IconButtonSize,
  color?: ColoringColor,
  coloringStyle?: ButtonColoringStyle,
  icon?: LucideIcon,
  iconSize?: ElementSize,
  children?: ReactNode,
  accessibilityLabel: string,
  style?: StyleProp<ViewStyle>,
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
  ...props
}, ref) {
  const { theme } = useTheme()
  const resolved = resolveIconButtonStyles({
    theme,
    size,
    color,
    coloringStyle,
    disabled: !!disabled,
  })

  const content = icon
    ? <Icon icon={icon} size={iconSize ?? size} color={resolved.color} />
    : children

  return (
    <Pressable
      {...props}
      ref={ref}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: resolved.backgroundColor,
          borderColor: resolved.borderColor,
          borderWidth: resolved.borderWidth ?? 0,
          width: resolved.minWidth,
          height: resolved.minHeight,
          borderRadius: resolved.borderRadius,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {content}
    </Pressable>
  )
})
