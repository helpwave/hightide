import { forwardRef } from 'react'
import type { Text as RNTextType, TextProps as RNTextProps } from 'react-native'
import { Text as RNText } from 'react-native'
import type { SemanticColorName, TypographyVariantName } from '@helpwave/hightide-tokens'
import { useHightideTheme } from '../theme/ThemeContext'

/** A semantic color name, or any raw color string. */
export type TextColor = SemanticColorName | (string & {})

export type TextProps = RNTextProps & {
  /**
   * A named typographic role (`titleMd`, `bodyLg`, …).
   * @default 'bodyMd'
   */
  variant?: TypographyVariantName,
  /**
   * A semantic color name (`onSurface`, `description`, `primary`, …) or a raw
   * color string.
   * @default 'onSurface'
   */
  color?: TextColor,
  /** Forwarded for NativeWind interop. */
  className?: string,
}

const resolveColor = (color: TextColor, colors: Record<string, string>): string =>
  color in colors ? colors[color as SemanticColorName]! : color

/**
 * The typographic primitive. Every piece of text in the native library is built
 * on `Text`, so font, size, weight and color always come from the design
 * tokens rather than ad-hoc values.
 */
export const Text = forwardRef<RNTextType, TextProps>(function Text({
  variant = 'bodyMd',
  color = 'onSurface',
  style,
  ...props
}, ref) {
  const { theme } = useHightideTheme()
  const typography = theme.typography[variant]

  return (
    <RNText
      ref={ref}
      style={[
        {
          fontFamily: typography.fontFamily,
          fontSize: typography.fontSize,
          lineHeight: typography.lineHeight,
          fontWeight: typography.fontWeight,
          color: resolveColor(color, theme.colors),
        },
        style,
      ]}
      {...props}
    />
  )
})
