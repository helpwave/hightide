import {
  type ButtonColoringStyle,
  type ColoringColor,
  resolveIconButtonStyles
} from '@helpwave/hightide-design'
import type { ElementSize } from '@helpwave/hightide-design'
import { forwardRef, type ReactNode } from 'react'
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'
import { useThemeMode } from '../../theme/ThemeContext'

export type IconButtonSize = ElementSize

export type IconButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  size?: IconButtonSize,
  color?: ColoringColor,
  coloringStyle?: ButtonColoringStyle,
  children: ReactNode,
  accessibilityLabel: string,
  style?: StyleProp<ViewStyle>,
}

export const IconButton = forwardRef<React.ComponentRef<typeof Pressable>, IconButtonProps>(function IconButton({
  children,
  size = 'md',
  color = 'neutral',
  coloringStyle = 'solid',
  disabled,
  accessibilityLabel,
  style,
  ...props
}, ref) {
  const mode = useThemeMode()
  const resolved = resolveIconButtonStyles({
    mode,
    size,
    color,
    coloringStyle,
    disabled: !!disabled,
  })

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
      {children}
    </Pressable>
  )
})
