import type { ColorToken } from '../primitive-tokens/color'
import type {
  OutlineStyle,
  OutlineToken,
  ShadowToken
} from '../theme-tokens/theme-tokens'

export type LayoutDirectionToken = 'horizontal' | 'vertical'
export type LayoutAlignmentToken = 'left-top' | 'left-center' | 'left-bottom' | 'center-top' | 'center-center' | 'center-bottom' | 'right-top' | 'right-center' | 'right-bottom'
export type AxisAligmentToken = 'start' | 'center' | 'end'
export type AlignSelfToken = AxisAligmentToken | 'stretch'
export type OverflowToken = 'visible' | 'hidden' | 'scroll'
export type SizeToken = number | `${number}%`
export type BorderRadiusToken = {
  type: 'all',
  value?: number,
} | {
  type: 'physicalCorner',
  topLeft?: number,
  topRight?: number,
  bottomLeft?: number,
  bottomRight?: number,
}
export type DirectionalToken<T> = {
  type: 'physicalAxis',
  horizontal?: T,
  vertical?: T,
} | {
  type: 'physicalSide',
  top?: T,
  right?: T,
  bottom?: T,
  left?: T,
} | {
  type: 'all',
  value?: T,
} | {
  type: 'logicalAxis',
  inline?: T,
  block?: T,
} | {
  type: 'logicalSide',
  inlineStart?: T,
  inlineEnd?: T,
  blockStart?: T,
  blockEnd?: T,
}
export type { OutlineStyle, OutlineToken }
export type BorderStyleToken = 'dotted' | 'dashed' | 'solid'
export type BorderToken = {
  width?: DirectionalToken<number>,
  color?: DirectionalToken<ColorToken>,
  style?: BorderStyleToken,
}

export type ContainerTokens = {
  backgroundColor?: ColorToken,
  opacity?: number,
  overflow?: OverflowToken,
  border?: BorderToken,
  size?: {
    height?: SizeToken,
    width?: SizeToken,
    minHeight?: SizeToken,
    minWidth?: SizeToken,
    maxHeight?: SizeToken,
    maxWidth?: SizeToken,
  },
  shape?: {
    borderRadius?: BorderRadiusToken,
    padding?: {
      vertical?: number,
      horizontal?: number,
    },
  },
  margin?: {
    vertical?: number,
    horizontal?: number,
  },
  layout?: {
    gap?: number,
    direction?: LayoutDirectionToken,
    mainAxisAlignment?: AxisAligmentToken,
    crossAxisAligment?: AxisAligmentToken,
    alignSelf?: AlignSelfToken,
  },
  decoration?: {
    shadow?: ShadowToken,
  },
  outline?: OutlineToken,
}
