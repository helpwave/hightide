import type { ReactNode } from 'react'
import type { ViewProps } from 'react-native'
import { StyleSheet, View as RNView } from 'react-native'
import type { ColoringRole, ColoringStyle, ElementSize, Theme } from '@helpwave/hightide-tokens'
import { space } from '@helpwave/hightide-tokens'
import { useHightideTheme } from '../theme/ThemeContext'
import { resolveColoring } from '../styling/coloring'
import { Text } from '../primitives/Text'

export type ChipColor = ColoringRole
export type ChipSize = ElementSize

type ChipGeometry = {
  paddingHorizontal: number,
  paddingVertical: number,
  borderRadius: number,
  fontSize: number,
  lineHeight: number,
}

const geometryFor = (theme: Theme, size: ChipSize): ChipGeometry => {
  switch (size) {
    case 'xs':
      return { paddingHorizontal: space(1.5), paddingVertical: space(0.5), borderRadius: theme.radii.sm, fontSize: 12, lineHeight: 15 }
    case 'sm':
      return { paddingHorizontal: space(2), paddingVertical: space(0.5), borderRadius: theme.radii.sm, fontSize: 14, lineHeight: 17 }
    case 'lg':
      return { paddingHorizontal: space(3), paddingVertical: space(1.5), borderRadius: theme.radii.md, fontSize: 16, lineHeight: 19 }
    case 'md':
    default:
      return { paddingHorizontal: space(2.5), paddingVertical: space(1), borderRadius: theme.radii.md, fontSize: 14, lineHeight: 17 }
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    columnGap: space(1),
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: space(2),
    rowGap: space(2),
  },
})

export type ChipProps = ViewProps & {
  /** @default 'neutral' */
  color?: ChipColor,
  /** @default 'solid' */
  coloringStyle?: ColoringStyle,
  /** @default 'md' */
  size?: ChipSize,
  children?: ReactNode,
  className?: string,
}

/** A small, non-interactive label used to tag or categorize content. */
export const Chip = ({
  color = 'neutral',
  coloringStyle = 'solid',
  size = 'md',
  children,
  style,
  ...props
}: ChipProps) => {
  const { theme } = useHightideTheme()
  const geometry = geometryFor(theme, size)
  const coloring = resolveColoring(theme, { role: color, coloringStyle })

  return (
    <RNView
      style={[
        styles.base,
        {
          paddingHorizontal: geometry.paddingHorizontal,
          paddingVertical: geometry.paddingVertical,
          borderRadius: geometry.borderRadius,
        },
        coloring.container,
        style,
      ]}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={{ color: coloring.content, fontSize: geometry.fontSize, lineHeight: geometry.lineHeight, fontWeight: '500' }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </RNView>
  )
}

export type ChipListProps = ViewProps & {
  list: ChipProps[],
  className?: string,
}

/** Lays out a collection of {@link Chip}s in a wrapping row. */
export const ChipList = ({ list, style, ...props }: ChipListProps) => {
  return (
    <RNView style={[styles.list, style]} {...props}>
      {list.map(({ children, ...chip }, index) => (
        <Chip key={index} {...chip}>{children}</Chip>
      ))}
    </RNView>
  )
}
