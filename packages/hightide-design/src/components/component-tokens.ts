import type { ColorToken } from '../primitive/color'
import type {
  ComponentSize,
  ComponentSizeBasic
} from '../theme/layout'
import type { ControlElementLayoutToken } from '../semantic/element-layout'

export type ComponentElementLayout = {
  size: number,
  inset: number,
  border: number,
  radius: number,
  gap: number,
  horizontalInset: number,
  minWidth: number,
  fontSize: number,
}

export type ComponentTokens = {
  button: {
    layout: Record<ComponentSize, ComponentElementLayout>,
  },
  iconButton: {
    layout: Record<ComponentSize, ComponentElementLayout>,
  },
  chip: {
    layout: Record<ComponentSize, ComponentElementLayout>,
  },
  input: ComponentElementLayout & {
    background: ColorToken,
    text: ColorToken,
  },
  checkbox: {
    layout: Record<ComponentSizeBasic, ControlElementLayoutToken>,
  },
  menu: {
    background: ColorToken,
    text: ColorToken,
    border: ColorToken,
  },
  progressIndicator: {
    fill: ColorToken,
    background: ColorToken,
  },
  switch: {
    track: {
      inactive: ColorToken,
      active: ColorToken,
    },
    thumb: {
      inactive: ColorToken,
      active: ColorToken,
    },
    borderColor: ColorToken,
  },
  icon: Record<ComponentSize, { size: number, strokeWidth: number }>,
  avatar: Record<ComponentSize, {
    size: number,
    padding: number,
    fontSize: number,
    statusDotSize: number,
    statusDotBorderWidth: number,
  }>,
  avatarGroup: {
    overlap: number,
    maxShown: number,
    gap: number,
  },
}
