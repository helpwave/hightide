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

import type { ChipVariant, ComponentSize } from '@helpwave/hightide-design/semantic-tokens'
import type { ColorPair } from '../../theme/types/color'
import { chipTokenContext } from '../../theme/component-contexts'

import { ContentThemeOverrideProvider } from '../../global-contexts/content-theme/ContentThemeProvider'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../hooks/useMemoizedTheme'
import type {
  ChipIconStyle,
  ChipState,
  ChipStyle,
  ChipTextStyle
} from '../../theme/types/components/chip'
import type { StyleOverwrite } from '../../theme/types/resolver'
import { ThemedText } from './ThemedText'

export type ChipSize = ComponentSize

export type ChipColor = ColorPair

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

  const state = useMemo((): ChipState => chipTokenContext(theme, {
    size,
    color,
    variant,
  }), [size, color, variant, theme])

  const resolvedChipStyle = useMemoizedTheme(theme.components.chip.container, state, chipStyle)
  const resolvedIconStyle = useMemoizedTheme(theme.components.chip.icon, state, iconStyle)
  const resolvedTextStyle = useMemoizedTheme(theme.components.chip.text, state, textStyle)

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
