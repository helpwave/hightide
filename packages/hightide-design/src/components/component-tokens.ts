import type { ColorToken } from '../primitive/color'
import type { ElementSize } from '../primitive/elements'

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
    layout: Record<ElementSize, ComponentElementLayout>,
  },
  iconButton: {
    layout: Record<ElementSize, ComponentElementLayout>,
  },
  chip: {
    layout: Record<ElementSize, ComponentElementLayout>,
  },
  input: ComponentElementLayout & {
    background: ColorToken,
    text: ColorToken,
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
  icon: Record<ElementSize, { size: number, strokeWidth: number }>,
  avatar: Record<ElementSize, {
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
