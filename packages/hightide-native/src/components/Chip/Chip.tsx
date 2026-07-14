import {
  coloringColors,
  type ChipColoringStyle,
  type ColoringColor,
  resolveChipStyles
} from '@helpwave/hightide-design'
import type { ElementSize } from '@helpwave/hightide-design'
import type { ReactNode } from 'react'
import { Text, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native'
import { useThemeMode } from '../../theme/ThemeContext'

export type ChipSize = ElementSize

export type ChipColor = ColoringColor

export const ChipUtil = {
  colors: coloringColors,
}

export type ChipProps = Omit<ViewProps, 'children' | 'style'> & {
  color?: ChipColor,
  coloringStyle?: ChipColoringStyle,
  size?: ChipSize,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
}

export const Chip = ({
  children,
  color = 'neutral',
  coloringStyle = 'solid',
  size = 'md',
  style,
  ...props
}: ChipProps) => {
  const mode = useThemeMode()
  const resolved = resolveChipStyles({
    mode,
    size,
    color,
    coloringStyle,
  })

  return (
    <View
      {...props}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'flex-start',
          backgroundColor: resolved.backgroundColor,
          borderColor: resolved.borderColor,
          borderWidth: resolved.borderWidth ?? 0,
          paddingVertical: resolved.paddingVertical,
          paddingHorizontal: resolved.paddingHorizontal,
          gap: resolved.gap,
          minHeight: resolved.minHeight,
          borderRadius: resolved.borderRadius,
        },
        style,
      ]}
    >
      {typeof children === 'string' || typeof children === 'number'
        ? <Text style={{ color: resolved.color, fontSize: resolved.fontSize, fontWeight: '600' }}>{children}</Text>
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
