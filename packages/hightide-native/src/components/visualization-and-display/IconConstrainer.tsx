import type { ReactNode } from 'react'
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'

import type { ComponentSize } from '@helpwave/hightide-design/theme-tokens'

import { useTheme } from '../../global-contexts/theme/ThemeContext'

export type IconConstrainerSize = ComponentSize

export type IconConstrainerProps = Omit<ViewProps, 'children' | 'style'> & {
  size?: IconConstrainerSize | number,
  children?: ReactNode,
  style?: StyleProp<ViewStyle>,
}

export const IconConstrainer = ({
  size = 'md',
  children,
  style,
  ...props
}: IconConstrainerProps) => {
  const { theme } = useTheme()
  const iconSize = typeof size === 'number'
    ? size
    : theme.components.icon[size].size

  return (
    <View
      {...props}
      style={[
        {
          width: iconSize,
          height: iconSize,
          minWidth: iconSize,
          maxWidth: iconSize,
          minHeight: iconSize,
          maxHeight: iconSize,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
