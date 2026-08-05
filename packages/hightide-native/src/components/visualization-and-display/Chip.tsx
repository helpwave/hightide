import {
  useMemo,
  type ReactNode
} from 'react'
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'

import type {
  ChipColoringStyle,
  ColorPairToken,
  ComponentSize
} from '@helpwave/hightide-design/theme-tokens'

import { ContentThemeProvider } from '../../global-contexts/content-theme/ContentThemeProvider'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  ChipState,
  ChipStyle,
  ChipTextStyle
} from '../../theme/types/components/chip'
import type { StyleOverwrite } from '../../theme/types/resolver'
import type { Color } from '../../theme/types/color'
import { ThemedText } from './ThemedText'

export type ChipSize = ComponentSize

export type ChipColor = ColorPairToken

export const ChipUtil = {
  sizes: ['sm', 'md', 'lg'] as const satisfies readonly ComponentSize[],
  coloringStyles: ['filled', 'tonal', 'outline', 'tonal-outline'] as const satisfies readonly ChipColoringStyle[],
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
  color,
  coloringStyle = 'filled',
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
      <ContentThemeProvider
        foregroundColor={resolvedTextStyle.color as Color}
        textStyle={resolvedTextStyle}
      >
        {typeof children === 'string' || typeof children === 'number'
          ? <ThemedText>{children}</ThemedText>
          : children}
      </ContentThemeProvider>
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
