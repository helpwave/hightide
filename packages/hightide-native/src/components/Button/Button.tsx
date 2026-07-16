import {
  coloringColors,
  type ButtonColoringStyle,
  type ColoringColor,
  resolveButtonStyles
} from '@helpwave/hightide-design'
import type { ElementSize } from '@helpwave/hightide-design'
import { forwardRef, type ReactNode } from 'react'
import { Pressable, Text, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'
import { useThemeMode } from '../../global-contexts/theme'

export type ButtonSize = ElementSize

export type ButtonColor = ColoringColor

export const ButtonUtil = {
  colors: coloringColors,
}

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  size?: ButtonSize,
  color?: ButtonColor,
  coloringStyle?: ButtonColoringStyle,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
}

export const Button = forwardRef<React.ComponentRef<typeof Pressable>, ButtonProps>(function Button({
  children,
  size = 'md',
  color = 'primary',
  coloringStyle = 'solid',
  disabled,
  style,
  ...props
}, ref) {
  const mode = useThemeMode()
  const resolved = resolveButtonStyles({
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
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: resolved.backgroundColor,
          borderColor: resolved.borderColor,
          borderWidth: resolved.borderWidth ?? 0,
          paddingVertical: resolved.paddingVertical,
          paddingHorizontal: resolved.paddingHorizontal,
          gap: resolved.gap,
          minWidth: resolved.minWidth,
          minHeight: resolved.minHeight,
          borderRadius: resolved.borderRadius,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {typeof children === 'string' || typeof children === 'number'
        ? <Text style={{ color: resolved.color, fontSize: resolved.fontSize, fontWeight: '600' }}>{children}</Text>
        : children}
    </Pressable>
  )
})
