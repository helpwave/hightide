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

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import type { ChipVariant, ComponentSize } from '@helpwave/hightide-design/semantic-token-resolvers'

import { ContentThemeOverrideProvider } from '../../global-contexts/content-theme/ContentThemeProvider'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
  ChipIconStyle,
  ChipState,
  ChipStyle,
  ChipTextStyle
} from '../../theme/types/components/chip'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { ThemedText } from './ThemedText'

export type ChipSize = ComponentSize

export type ChipColor = ColorPairToken

export const ChipUtil = {
  sizes: ['sm', 'md', 'lg'] as const satisfies readonly ComponentSize[],
  variants: ['filled', 'tonal'] as const satisfies readonly ChipVariant[],
}

export type ChipProps = Omit<ViewProps, 'children' | 'style'> & {
  color?: ChipColor,
  variant?: ChipVariant,
  size?: ChipSize,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  chipStyle?: StyleOverwrite<ChipState, ChipStyle>,
  iconStyle?: StyleOverwrite<ChipState, ChipIconStyle>,
  textStyle?: StyleOverwrite<ChipState, ChipTextStyle>,
}

export const Chip = ({
  children,
  color,
  variant = 'filled',
  size = 'md',
  style,
  chipStyle,
  iconStyle,
  textStyle,
  ...props
}: ChipProps) => {
  const { theme } = useTheme()

  const state = useMemo((): ChipState => ({
    size,
    color,
    variant,
  }), [size, color, variant])

  const resolvedChipStyle = useMemo(
    () => theme.components.chip.chip(state, chipStyle),
    [theme, state, chipStyle]
  )
  const resolvedIconStyle = useMemo(
    () => theme.components.chip.icon(state, iconStyle),
    [theme, state, iconStyle]
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
      <ContentThemeOverrideProvider
        foreground={resolvedTextStyle.color}
        background={resolvedChipStyle.backgroundColor}
        textStyle={resolvedTextStyle}
        iconStyle={resolvedIconStyle}
      >
        {typeof children === 'string' || typeof children === 'number'
          ? <ThemedText>{children}</ThemedText>
          : children}
      </ContentThemeOverrideProvider>
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
