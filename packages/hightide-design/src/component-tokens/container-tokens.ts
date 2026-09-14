import type { AxisAlignmentToken } from '../primitive-tokens/axis-alignment-token'
import type { BorderStyleToken } from '../primitive-tokens/border-style-token'
import type { ColorValueToken } from '../primitive-tokens/color-value-token'
import type { CrossAxisAlignmentToken } from '../primitive-tokens/cross-axis-alignment-token'
import type { CrossAxisLineAlignmentToken } from '../primitive-tokens/cross-axis-line-alignment-token'
import type { FlexWrapToken } from '../primitive-tokens/flex-wrap-token'
import type { LayoutDirectionToken } from '../primitive-tokens/layout-direction-token'
import type { MainAxisAlignmentToken } from '../primitive-tokens/main-axis-alignment-token'
import type { NumberValueToken } from '../primitive-tokens/number-value-token'
import type { OutlineStyleToken } from '../primitive-tokens/outline-style-token'
import type { OverflowToken } from '../primitive-tokens/overflow-token'
import type { PercentToken } from '../primitive-tokens/percent-token'

export type { AxisAlignmentToken } from '../primitive-tokens/axis-alignment-token'
export type { BorderStyleToken } from '../primitive-tokens/border-style-token'
export type { CrossAxisAlignmentToken } from '../primitive-tokens/cross-axis-alignment-token'
export type { CrossAxisLineAlignmentToken } from '../primitive-tokens/cross-axis-line-alignment-token'
export type { FlexWrapToken } from '../primitive-tokens/flex-wrap-token'
export type { LayoutDirectionToken } from '../primitive-tokens/layout-direction-token'
export type { MainAxisAlignmentToken } from '../primitive-tokens/main-axis-alignment-token'
export type { OverflowToken } from '../primitive-tokens/overflow-token'
export type { StretchToken } from '../primitive-tokens/stretch-token'

export type AxisAligmentToken = AxisAlignmentToken
export type MainAxisAligmentToken = MainAxisAlignmentToken
export type CrossAxisLineAligmentToken = CrossAxisLineAlignmentToken

export type SizeToken = NumberValueToken | PercentToken

export type StaticPositionTokens = {
  type: 'static',
  zIndex?: NumberValueToken,
}

export type RelativePositionTokens = {
  type: 'relative',
  left?: SizeToken,
  right?: SizeToken,
  top?: SizeToken,
  bottom?: SizeToken,
  zIndex?: NumberValueToken,
}

export type AbsolutePositionTokens = {
  type: 'absolute',
  left?: SizeToken,
  right?: SizeToken,
  top?: SizeToken,
  bottom?: SizeToken,
  zIndex?: NumberValueToken,
}

export type PositioningToken = StaticPositionTokens | RelativePositionTokens | AbsolutePositionTokens

export type TransformTokens = {
  translate?: {
    x?: NumberValueToken,
    y?: NumberValueToken,
  },
  scale?: {
    x?: NumberValueToken,
    y?: NumberValueToken,
  },
  rotation?: {
    x?: NumberValueToken,
    y?: NumberValueToken,
    z?: NumberValueToken,
  },
  skew?: {
    x?: NumberValueToken,
    y?: NumberValueToken,
  },
}

export type BorderRadiusToken = {
  topLeft?: NumberValueToken,
  topRight?: NumberValueToken,
  bottomRight?: NumberValueToken,
  bottomLeft?: NumberValueToken,
}

export type OutlineToken = {
  width?: NumberValueToken,
  offset?: NumberValueToken,
  color?: ColorValueToken,
  style?: OutlineStyleToken,
}

export type ShadowToken = {
  x: NumberValueToken,
  y: NumberValueToken,
  blur: NumberValueToken,
  spread: NumberValueToken,
  color: ColorValueToken,
}

export type BorderWidthToken = {
  left?: NumberValueToken,
  right?: NumberValueToken,
  top?: NumberValueToken,
  bottom?: NumberValueToken,
}

export type BorderColorToken = {
  left?: ColorValueToken,
  right?: ColorValueToken,
  top?: ColorValueToken,
  bottom?: ColorValueToken,
}

export type BorderToken = {
  width?: BorderWidthToken,
  color?: BorderColorToken,
  style?: BorderStyleToken,
}

export type PaddingToken = {
  left?: NumberValueToken,
  right?: NumberValueToken,
  top?: NumberValueToken,
  bottom?: NumberValueToken,
}

export type MarginToken = {
  left?: NumberValueToken,
  right?: NumberValueToken,
  top?: NumberValueToken,
  bottom?: NumberValueToken,
}

export type ContainerSizeTokens = {
  height?: SizeToken,
  width?: SizeToken,
  minHeight?: SizeToken,
  minWidth?: SizeToken,
  maxHeight?: SizeToken,
  maxWidth?: SizeToken,
}

export type ContainerLayoutTokens = {
  flexWrap?: FlexWrapToken,
  gap?: NumberValueToken,
  direction?: LayoutDirectionToken,
  mainAxisAlignment?: MainAxisAlignmentToken,
  crossAxisAlignment?: CrossAxisAlignmentToken,
  crossAxisLineAlignment?: CrossAxisLineAlignmentToken,
  selfCrossAxisAlignment?: CrossAxisAlignmentToken,
  flexGrow?: NumberValueToken,
  flexShrink?: NumberValueToken,
  flexBasis?: SizeToken,
}

export type ContainerTokens = {
  type: 'container',
  backgroundColor?: ColorValueToken,
  opacity?: NumberValueToken,
  overflow?: OverflowToken,
  position?: PositioningToken,
  transform?: TransformTokens,
  border?: BorderToken,
  size?: ContainerSizeTokens,
  borderRadius?: BorderRadiusToken,
  padding?: PaddingToken,
  margin?: MarginToken,
  layout?: ContainerLayoutTokens,
  shadow?: ShadowToken,
  outline?: OutlineToken,
}
