import type { HexColor } from '../utils/hex-color'
import type { AxisAlignmentValue } from '../primitive-tokens/axis-alignment-token'
import type { BorderStyleValue } from '../primitive-tokens/border-style-token'
import type { CrossAxisAlignmentValue } from '../primitive-tokens/cross-axis-alignment-token'
import type { CrossAxisLineAlignmentValue } from '../primitive-tokens/cross-axis-line-alignment-token'
import type { FlexWrapValue } from '../primitive-tokens/flex-wrap-token'
import type { LayoutDirectionValue } from '../primitive-tokens/layout-direction-token'
import type { MainAxisAlignmentValue } from '../primitive-tokens/main-axis-alignment-token'
import type { OutlineStyleValue } from '../primitive-tokens/outline-style-token'
import type { OverflowValue } from '../primitive-tokens/overflow-token'

export type Size = number | `${number}%`

export type StaticPosition = {
  type: 'static',
  zIndex?: number,
}

export type RelativePosition = {
  type: 'relative',
  left?: Size,
  right?: Size,
  top?: Size,
  bottom?: Size,
  zIndex?: number,
}

export type AbsolutePosition = {
  type: 'absolute',
  left?: Size,
  right?: Size,
  top?: Size,
  bottom?: Size,
  zIndex?: number,
}

export type Positioning = StaticPosition | RelativePosition | AbsolutePosition

export type Transform = {
  translate?: {
    x?: number,
    y?: number,
  },
  scale?: {
    x?: number,
    y?: number,
  },
  rotation?: {
    x?: number,
    y?: number,
    z?: number,
  },
  skew?: {
    x?: number,
    y?: number,
  },
}

export type BorderRadius = {
  topLeft?: number,
  topRight?: number,
  bottomRight?: number,
  bottomLeft?: number,
}

export type Outline = {
  width?: number,
  offset?: number,
  color?: HexColor,
  style?: OutlineStyleValue,
}

export type Shadow = {
  x: number,
  y: number,
  blur: number,
  spread: number,
  color: HexColor,
}

export type BorderWidth = {
  left?: number,
  right?: number,
  top?: number,
  bottom?: number,
}

export type BorderColor = {
  left?: HexColor,
  right?: HexColor,
  top?: HexColor,
  bottom?: HexColor,
}

export type Border = {
  width?: BorderWidth,
  color?: BorderColor,
  style?: BorderStyleValue,
}

export type Padding = {
  left?: number,
  right?: number,
  top?: number,
  bottom?: number,
}

export type Margin = {
  left?: number,
  right?: number,
  top?: number,
  bottom?: number,
}

export type ContainerSize = {
  height?: Size,
  width?: Size,
  minHeight?: Size,
  minWidth?: Size,
  maxHeight?: Size,
  maxWidth?: Size,
}

export type LayoutDirection = LayoutDirectionValue

export type ContainerLayout = {
  flexWrap?: FlexWrapValue,
  gap?: number,
  direction?: LayoutDirection,
  mainAxisAlignment?: MainAxisAlignmentValue,
  crossAxisAlignment?: CrossAxisAlignmentValue,
  crossAxisLineAlignment?: CrossAxisLineAlignmentValue,
  selfCrossAxisAlignment?: CrossAxisAlignmentValue,
  flexGrow?: number,
  flexShrink?: number,
  flexBasis?: Size,
}

export type ContainerStyle = {
  type: 'container',
  backgroundColor?: HexColor,
  opacity?: number,
  overflow?: OverflowValue,
  position?: Positioning,
  transform?: Transform,
  border?: Border,
  size?: ContainerSize,
  borderRadius?: BorderRadius,
  padding?: Padding,
  margin?: Margin,
  layout?: ContainerLayout,
  shadow?: Shadow,
  outline?: Outline,
}

export type AxisAlignment = AxisAlignmentValue
export type MainAxisAlignment = MainAxisAlignmentValue
export type CrossAxisAlignment = CrossAxisAlignmentValue
export type CrossAxisLineAlignment = CrossAxisLineAlignmentValue
