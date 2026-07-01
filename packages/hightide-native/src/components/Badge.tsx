import type { ReactNode } from 'react'
import type { ViewProps } from 'react-native'
import { StyleSheet, View as RNView } from 'react-native'
import type { ColoringRole, ColoringStyle } from '@helpwave/hightide-tokens'
import { useHightideTheme } from '../theme/ThemeContext'
import { resolveColoring } from '../styling/coloring'
import { Text } from '../primitives/Text'

export type BadgeProps = ViewProps & {
  /** @default 'primary' */
  color?: ColoringRole,
  /** @default 'solid' */
  coloringStyle?: ColoringStyle,
  /** Render as a small dot with no content. */
  dot?: boolean,
  children?: ReactNode,
  className?: string,
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  pill: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
  },
  dot: {
    width: 10,
    height: 10,
  },
})

/**
 * A compact status indicator – a rounded pill for short labels/counts, or a
 * bare dot (`dot`) for presence indicators.
 */
export const Badge = ({ color = 'primary', coloringStyle = 'solid', dot = false, children, style, ...props }: BadgeProps) => {
  const { theme } = useHightideTheme()
  const coloring = resolveColoring(theme, { role: color, coloringStyle })

  return (
    <RNView style={[styles.base, dot ? styles.dot : styles.pill, coloring.container, style]} {...props}>
      {!dot && (typeof children === 'string' ? (
        <Text style={{ color: coloring.content, fontSize: 12, lineHeight: 15, fontWeight: '600' }}>{children}</Text>
      ) : (
        children
      ))}
    </RNView>
  )
}
