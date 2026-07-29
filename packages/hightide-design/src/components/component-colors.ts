import type { ColorToken } from '../primitive/color'

export type ComponentColorTokens = {
  input: {
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
  border: ColorToken,
  divider: ColorToken,
  focus: ColorToken,
}
