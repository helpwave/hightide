import type { ComponentType } from 'react'

export type IconComponentProps = {
  size?: number,
  color?: string,
  strokeWidth?: number,
}

export type IconComponent = ComponentType<IconComponentProps>
