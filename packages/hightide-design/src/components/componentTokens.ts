import type { ColorToken } from '../primitive/color'
import type {
  ComponentSize,
  ComponentSizeBasic
} from '../theme/layout'
import type { HightideControlElementLayoutToken } from '../semantic/elementLayout'

export type HightideComponentElementLayout = {
  size: number,
  inset: number,
  border: number,
  radius: number,
  gap: number,
  horizontalInset: number,
  minWidth: number,
  fontSize: number,
}

export type HightideComponentTokens = {
  button: {
    layout: Record<ComponentSize, HightideComponentElementLayout>,
  },
  iconButton: {
    layout: Record<ComponentSize, HightideComponentElementLayout>,
  },
  chip: {
    layout: Record<ComponentSize, HightideComponentElementLayout>,
  },
  input: HightideComponentElementLayout & {
    background: ColorToken,
    text: ColorToken,
  },
  checkbox: {
    layout: Record<ComponentSizeBasic, HightideControlElementLayoutToken>,
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
