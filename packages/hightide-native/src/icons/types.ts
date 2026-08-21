import type { ComponentType } from 'react'
import type { ColorValue } from 'react-native'

export type IconStyle = {
  size?: number,
  color?: ColorValue,
  strokeWidth?: number,
}

export type IconComponentProps = IconStyle

export type IconComponent = ComponentType<IconComponentProps>
