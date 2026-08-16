import type { ComponentType } from 'react'

export type IconStyle = {
  size?: number,
  color?: string,
  strokeWidth?: number,
}

export type IconComponentProps = IconStyle

export type IconComponent = ComponentType<IconComponentProps>
