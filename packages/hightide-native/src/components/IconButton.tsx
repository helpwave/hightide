import { forwardRef } from 'react'
import type { PressableProps, PressableStateCallbackType, View } from 'react-native'
import { Pressable, StyleSheet } from 'react-native'
import type { ColoringRole, ColoringStyle, ElementSize } from '@helpwave/hightide-tokens'
import { useHightideTheme } from '../theme/ThemeContext'
import { resolveColoring } from '../styling/coloring'
import { resolveElement } from '../styling/element'
import { iconSizeForElement, renderSlot } from '../styling/slot'
import type { Slot } from '../styling/slot'

export type IconButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  /** The icon to render (node or `({ color, size }) => node`). */
  icon: Slot,
  /**
   * Accessible label for the action – required, since there is no visible text.
   */
  accessibilityLabel: string,
  /** @default 'md' */
  size?: ElementSize,
  /** @default 'neutral' */
  color?: ColoringRole,
  /** @default 'text' */
  coloringStyle?: ColoringStyle,
  disabled?: boolean,
  className?: string,
  style?: PressableProps['style'],
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

/**
 * A square, icon-only button. Defaults to the subtle `text` treatment with the
 * `neutral` role, like the web icon buttons.
 */
export const IconButton = forwardRef<View, IconButtonProps>(function IconButton({
  icon,
  size = 'md',
  color = 'neutral',
  coloringStyle = 'text',
  disabled = false,
  style,
  ...props
}, ref) {
  const { theme } = useHightideTheme()
  const element = resolveElement(theme, size)

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      style={(state: PressableStateCallbackType) => {
        const coloring = resolveColoring(theme, { role: color, coloringStyle, pressed: state.pressed, disabled })
        return [
          styles.base,
          {
            width: element.height,
            height: element.height,
            borderRadius: element.borderRadius,
          },
          coloring.container,
          typeof style === 'function' ? style(state) : style,
        ]
      }}
      {...props}
    >
      {(state: PressableStateCallbackType) => {
        const coloring = resolveColoring(theme, { role: color, coloringStyle, pressed: state.pressed, disabled })
        return renderSlot(icon, coloring.content, iconSizeForElement[size])
      }}
    </Pressable>
  )
})
