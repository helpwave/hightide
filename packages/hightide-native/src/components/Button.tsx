import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import type { PressableProps, PressableStateCallbackType, View } from 'react-native'
import { Pressable, StyleSheet } from 'react-native'
import type { ColoringRole, ColoringStyle, ElementSize } from '@helpwave/hightide-tokens'
import { useHightideTheme } from '../theme/ThemeContext'
import { resolveColoring } from '../styling/coloring'
import { resolveElement } from '../styling/element'
import { iconSizeForElement, renderSlot } from '../styling/slot'
import type { Slot } from '../styling/slot'
import { Text } from '../primitives/Text'

export type ButtonColor = ColoringRole
export type ButtonSize = ElementSize
export type { ColoringStyle }

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  /** @default 'md' */
  size?: ButtonSize,
  /** @default 'primary' */
  color?: ButtonColor,
  /** @default 'solid' */
  coloringStyle?: ColoringStyle,
  disabled?: boolean,
  /** Leading icon slot (node or `({ color, size }) => node`). */
  leading?: Slot,
  /** Trailing icon slot (node or `({ color, size }) => node`). */
  trailing?: Slot,
  /** Button label. Strings are wrapped in a themed `Text`; nodes render as-is. */
  children?: ReactNode,
  className?: string,
  style?: PressableProps['style'],
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
})

/**
 * A button with the four hightide sizes and the full role × treatment coloring
 * model (solid / tonal / outline / text / tonal-outline). Press state maps to
 * the web `:hover` treatment.
 */
export const Button = forwardRef<View, ButtonProps>(function Button({
  size = 'md',
  color = 'primary',
  coloringStyle = 'solid',
  disabled = false,
  leading,
  trailing,
  children,
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
            height: element.height,
            paddingVertical: element.paddingVertical,
            paddingHorizontal: element.paddingHorizontal,
            columnGap: element.gap,
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
        const iconSize = iconSizeForElement[size]
        return (
          <>
            {renderSlot(leading, coloring.content, iconSize)}
            {typeof children === 'string' ? (
              <Text style={[element.text, { color: coloring.content }]}>{children}</Text>
            ) : (
              children
            )}
            {renderSlot(trailing, coloring.content, iconSize)}
          </>
        )
      }}
    </Pressable>
  )
})
