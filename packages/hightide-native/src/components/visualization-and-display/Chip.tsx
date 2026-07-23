import {
  useMemo,
  type ReactNode
} from 'react'
import {
  Text,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'

import {
  coloringTypes,
  type ColoringType
} from '@helpwave/hightide-design/utils'
import type {
  ChipColoringStyle,
  ElementSize
} from '@helpwave/hightide-design/types'

import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  ChipState,
  ChipStyle,
  ChipTextStyle
} from '../../theme/types/components/chip'
import type { StyleOverwrite } from '../../theme/types/resolver'

export type ChipSize = ElementSize

export type ChipColor = ColoringType

export const ChipUtil = {
  colors: coloringTypes,
  sizes: ['xs', 'sm', 'md', 'lg'] as const satisfies readonly ElementSize[],
  coloringStyles: ['solid', 'tonal', 'outline', 'tonal-outline'] as const satisfies readonly ChipColoringStyle[],
}

export type ChipProps = Omit<ViewProps, 'children' | 'style'> & {
  color?: ChipColor,
  coloringStyle?: ChipColoringStyle,
  size?: ChipSize,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  chipStyle?: StyleOverwrite<ChipState, ChipStyle>,
  textStyle?: StyleOverwrite<ChipState, ChipTextStyle>,
}

export const Chip = ({
  children,
  color = 'neutral',
  coloringStyle = 'solid',
  size = 'md',
  style,
  chipStyle,
  textStyle,
  ...props
}: ChipProps) => {
  const { theme } = useTheme()

  const state = useMemo((): ChipState => ({
    size,
    color,
    coloringStyle,
  }), [size, color, coloringStyle])

  const resolvedChipStyle = useMemo(
    () => theme.components.chip.chip(state, chipStyle),
    [theme, state, chipStyle]
  )
  const resolvedTextStyle = useMemo(
    () => theme.components.chip.text(state, textStyle),
    [theme, state, textStyle]
  )

  return (
    <View
      {...props}
      style={[resolvedChipStyle, style]}
    >
      {typeof children === 'string' || typeof children === 'number'
        ? <Text style={resolvedTextStyle}>{children}</Text>
        : children}
    </View>
  )
}

export type ChipListProps = Omit<ViewProps, 'children' | 'style'> & {
  list: ChipProps[],
  style?: StyleProp<ViewStyle>,
}

export const ChipList = ({
  list,
  style,
  ...props
}: ChipListProps) => {
  return (
    <View
      {...props}
      style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, style]}
    >
      {list.map((chipProps, index) => (
        <Chip key={index} {...chipProps} />
      ))}
    </View>
  )
}
