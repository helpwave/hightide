import type { ColorToken } from '../primitive-tokens/color'
import type {
  OutlineStyle,
  OutlineToken,
  ShadowToken
} from '../theme-tokens/theme-tokens'

export type LayoutDirectionToken = 'horizontal' | 'vertical'
export type LayoutAlignmentToken = 'left-top' | 'left-center' | 'left-bottom' | 'center-top' | 'center-center' | 'center-bottom' | 'right-top' | 'right-center' | 'right-bottom'
export type AxisAligmentToken = 'start' | 'center' | 'end'
export type StretchToken = 'stretch'
export type SpacingToken = 'space-between' | 'space-evenly' | 'space-around'
export type MainAxisAligmentToken = AxisAligmentToken | SpacingToken
export type CrossAxisAlignmentToken = AxisAligmentToken | StretchToken
export type CrossAxisLineAligmentToken = AxisAligmentToken | SpacingToken | StretchToken
export type FlexWrapToken = 'nowrap' | 'wrap' | 'wrap-reverse'
export type OverflowToken = 'visible' | 'hidden' | 'scroll'
export type SizeToken = number | `${number}%`
export type StaticPositionTokens = {
  type: 'static',
}
export type RelativePositionTokens = {
  type: 'relative',
  left?: SizeToken,
  right?: SizeToken,
  top?: SizeToken,
  bottom?: SizeToken,
}
export type AbsolutePositionTokens = {
  type: 'absolute',
  left?: SizeToken,
  right?: SizeToken,
  top?: SizeToken,
  bottom?: SizeToken,
}
export type PositioningToken = StaticPositionTokens | RelativePositionTokens | AbsolutePositionTokens
export type DegreeToken = `${string}deg`
// TODO: Add Matrix and perspective later
export type TransformTokens = {
  translate?: {
    x?: number,
    y?: number,
  },
  scale?: {
    x?: number,
    y?: number,
  },
  rotation?: {
    x?: DegreeToken,
    y?: DegreeToken,
    z?: DegreeToken,
  },
  skew?: {
    x?: number,
    y?: number,
  },
}
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

export type PhysicalAxisToken<T> = {
  type: 'physicalAxis',
  horizontal?: T,
  vertical?: T,
}
export type PhysicalSideToken<T> = {
  type: 'physicalSide',
  top?: T,
  right?: T,
  bottom?: T,
  left?: T,
}
export type AllToken<T> = {
  type: 'all',
  value?: T,
}
export type LogicalAxisToken<T> = {
  type: 'logicalAxis',
  inline?: T,
  block?: T,
}
export type LogicalSideToken<T> ={
  type: 'logicalSide',
  inlineStart?: T,
  inlineEnd?: T,
  blockStart?: T,
  blockEnd?: T,
}
export type DirectionalToken<T> = PhysicalAxisToken<T> | PhysicalSideToken<T> | AllToken<T> | LogicalAxisToken<T>  | LogicalSideToken<T>
export type { OutlineStyle, OutlineToken }
export type BorderStyleToken = 'dotted' | 'dashed' | 'solid'
export type BorderToken = {
  width?: DirectionalToken<number>,
  color?: DirectionalToken<ColorToken>,
  style?: BorderStyleToken,
}
export type PaddingToken = DirectionalToken<number>
export type MarginToken = DirectionalToken<number>

export type ContainerTokens = {
  backgroundColor?: ColorToken,
  opacity?: number,
  overflow?: OverflowToken,
  position?: PositioningToken,
  transform?: TransformTokens,
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
  },
  padding?: PaddingToken,
  margin?: MarginToken,
  layout?: {
    flexWrap?: FlexWrapToken,
    gap?: number,
    direction?: LayoutDirectionToken,
    mainAxisAlignment?: MainAxisAligmentToken,
    crossAxisAlignment?: CrossAxisAlignmentToken,
    crossAxisLineAligment?: CrossAxisLineAligmentToken,
    selfCrossAxisAlignment?: CrossAxisAlignmentToken,
    flexGrow?: number,
    flexShrink?: number,
    flexBasis?: SizeToken | 'auto',
  },
  decoration?: {
    shadow?: ShadowToken,
  },
  outline?: OutlineToken,
}
