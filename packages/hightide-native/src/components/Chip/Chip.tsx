import {
  coloringColors,
  type ChipColoringStyle,
  type ColoringType,
  type ElementSize
} from '@helpwave/hightide-design'
import type { ReactNode } from 'react'
import {
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle
} from 'react-native'
import { useTheme } from '../../global-contexts/theme'
import type { ChipState, ChipStyle, ChipTextStyle } from '../../theme'

export type ChipSize = ElementSize

export type ChipColor = ColoringType

export const ChipUtil = {
  colors: coloringColors,
  sizes: ['xs', 'sm', 'md', 'lg'] as const satisfies readonly ElementSize[],
  coloringStyles: ['solid', 'tonal', 'outline', 'tonal-outline'] as const satisfies readonly ChipColoringStyle[],
}

export type ChipProps = Omit<ViewProps, 'children' | 'style'> & {
  color?: ChipColor,
  coloringStyle?: ChipColoringStyle,
  size?: ChipSize,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
  chipStyle?: StyleProp<ViewStyle> | ((style: ChipStyle) => StyleProp<ViewStyle>),
  textStyle?: StyleProp<TextStyle> | ((style: ChipTextStyle) => StyleProp<TextStyle>),
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
  const state: ChipState = {
    size,
    color,
    coloringStyle,
  }

  const resolvedChip = theme.components.chip.chip(state)
  const resolvedText = theme.components.chip.text(state)
  const appliedChipStyle = typeof chipStyle === 'function' ? chipStyle(resolvedChip) : [resolvedChip, chipStyle]
  const appliedTextStyle = typeof textStyle === 'function' ? textStyle(resolvedText) : [resolvedText, textStyle]

  return (
    <View
      {...props}
      style={[appliedChipStyle, style]}
    >
      {typeof children === 'string' || typeof children === 'number'
        ? <Text style={appliedTextStyle}>{children}</Text>
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
