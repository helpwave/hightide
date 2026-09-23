import {
  PixelRatio,
  StyleSheet,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from 'react-native'

import type {
  Border,
  BorderRadius,
  ContainerLayout,
  ContainerStyle,
  CrossAxisAlignment,
  CrossAxisLineAlignment,
  IconStyle as DesignIconStyle,
  LayoutDirection,
  MainAxisAlignment,
  Margin,
  Padding,
  Positioning,
  Shadow,
  TextStyle as DesignTextStyle,
  Transform
} from '@helpwave/hightide-design/resolver'
import type { AxisAlignment } from '@helpwave/hightide-design/resolver'
import type { IconStyle } from '../../icons'
import type { SingleOrArray } from '@helpwave/hightide-utils/utils'
import { ArrayUtil } from '@helpwave/hightide-utils/utils'

function getStyleProperty<
  T extends ViewStyle,
  K extends keyof T
>(
  style: StyleProp<T>,
  property: K
): T[K] {
  if (style == null) {
    return undefined as T[K]
  }

  if (Array.isArray(style)) {
    for (let i = style.length - 1; i >= 0; i--) {
      const value = getStyleProperty(
        style[i] as StyleProp<T>,
        property
      )

      if (value !== undefined) {
        return value
      }
    }

    return undefined as T[K]
  }

  const flattened = StyleSheet.flatten(style) as T
  return flattened[property]
}

type OptionalViewStyle<K extends keyof ViewStyle> = {
  [P in K]?: ViewStyle[P]
}

const defined = <T extends object>(style: T): T => {
  const result = {} as T

  for (const key of Object.keys(style) as (keyof T)[]) {
    if (style[key] !== undefined) {
      result[key] = style[key]
    }
  }

  return result
}

const toFlexStartEnd = (
  alignment: AxisAlignment
): 'flex-start' | 'flex-end' | 'center' => {
  if (alignment === 'start') {
    return 'flex-start'
  }

  if (alignment === 'end') {
    return 'flex-end'
  }

  return 'center'
}

const shadowStyleAdapter = (
  shadow?: SingleOrArray<Shadow>
): ViewStyle['boxShadow'] | undefined => {
  if (shadow === undefined) {
    return undefined
  }

  return ArrayUtil.resolveSingleOrArray(shadow).map((shadow) => ({
    color: shadow.color,
    offsetX: shadow.x,
    offsetY: shadow.y,
    blurRadius: shadow.blur,
    spreadDistance: shadow.spread,
  }))
}

const flexDirectionStyleAdapter = (
  direction?: LayoutDirection
): ViewStyle['flexDirection'] | undefined => {
  if (direction === undefined) {
    return undefined
  }

  return direction === 'horizontal' ? 'row' : 'column'
}

const justifyContentStyleAdapter = (
  alignment?: MainAxisAlignment
): ViewStyle['justifyContent'] | undefined => {
  if (alignment === undefined) {
    return undefined
  }

  if (alignment === 'space-between' || alignment === 'space-evenly' || alignment === 'space-around') {
    return alignment
  }

  return toFlexStartEnd(alignment)
}

const alignItemsStyleAdapter = (
  alignment?: CrossAxisAlignment
): ViewStyle['alignItems'] | undefined => {
  if (alignment === undefined) {
    return undefined
  }

  if (alignment === 'stretch') {
    return alignment
  }

  return toFlexStartEnd(alignment)
}

const alignSelfStyleAdapter = (
  alignment?: CrossAxisAlignment
): ViewStyle['alignSelf'] | undefined => {
  if (alignment === undefined) {
    return undefined
  }

  if (alignment === 'stretch') {
    return alignment
  }

  return toFlexStartEnd(alignment)
}

const alignContentStyleAdapter = (
  alignment?: CrossAxisLineAlignment
): ViewStyle['alignContent'] | undefined => {
  if (alignment === undefined) {
    return undefined
  }

  if (
    alignment === 'stretch'
    || alignment === 'space-between'
    || alignment === 'space-evenly'
    || alignment === 'space-around'
  ) {
    return alignment
  }

  return toFlexStartEnd(alignment)
}

const borderRadiusStyleAdapter = (
  borderRadius?: BorderRadius
): OptionalViewStyle<
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderBottomLeftRadius'
  | 'borderBottomRightRadius'
> | undefined => {
  if (borderRadius === undefined) {
    return undefined
  }

  return defined({
    borderTopLeftRadius: borderRadius.topLeft,
    borderTopRightRadius: borderRadius.topRight,
    borderBottomLeftRadius: borderRadius.bottomLeft,
    borderBottomRightRadius: borderRadius.bottomRight,
  })
}

const borderWidthStyleAdapter = (
  width?: Border['width']
): OptionalViewStyle<
  | 'borderTopWidth'
  | 'borderRightWidth'
  | 'borderBottomWidth'
  | 'borderLeftWidth'
> | undefined => {
  if (width === undefined) {
    return undefined
  }

  return defined({
    borderTopWidth: width.top,
    borderRightWidth: width.right,
    borderBottomWidth: width.bottom,
    borderLeftWidth: width.left,
  })
}

const borderColorStyleAdapter = (
  color?: Border['color']
): OptionalViewStyle<
  | 'borderTopColor'
  | 'borderRightColor'
  | 'borderBottomColor'
  | 'borderLeftColor'
> | undefined => {
  if (color === undefined) {
    return undefined
  }

  return defined({
    borderTopColor: color.top,
    borderRightColor: color.right,
    borderBottomColor: color.bottom,
    borderLeftColor: color.left,
  })
}

const borderStyleAdapter = (
  border?: Border
): OptionalViewStyle<
  | 'borderStyle'
  | 'borderTopWidth'
  | 'borderRightWidth'
  | 'borderBottomWidth'
  | 'borderLeftWidth'
  | 'borderTopColor'
  | 'borderRightColor'
  | 'borderBottomColor'
  | 'borderLeftColor'
> | undefined => {
  if (border === undefined) {
    return undefined
  }

  return defined({
    borderStyle: border.style,
    ...borderWidthStyleAdapter(border.width),
    ...borderColorStyleAdapter(border.color),
  })
}

const paddingStyleAdapter = (
  padding?: Padding
): OptionalViewStyle<
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'
> | undefined => {
  if (padding === undefined) {
    return undefined
  }

  return defined({
    paddingTop: padding.top,
    paddingRight: padding.right,
    paddingBottom: padding.bottom,
    paddingLeft: padding.left,
  })
}

const marginStyleAdapter = (
  margin?: Margin
): OptionalViewStyle<
  | 'marginTop'
  | 'marginRight'
  | 'marginBottom'
  | 'marginLeft'
> | undefined => {
  if (margin === undefined) {
    return undefined
  }

  return defined({
    marginTop: margin.top,
    marginRight: margin.right,
    marginBottom: margin.bottom,
    marginLeft: margin.left,
  })
}

const sizeStyleAdapter = (
  size?: ContainerStyle['size']
): OptionalViewStyle<
  | 'width'
  | 'height'
  | 'minWidth'
  | 'minHeight'
  | 'maxWidth'
  | 'maxHeight'
> | undefined => {
  if (size === undefined) {
    return undefined
  }

  return defined({
    width: size.width,
    height: size.height,
    minWidth: size.minWidth,
    // minHeight is rounded to the nearest pixel to avoid blurry edges and gaps multiselects on certain devices.
    // See https://reactnative.dev/docs/pixelratio#pixelroundtonearestpixel for more information.
    minHeight: typeof size.minHeight === 'number' ? PixelRatio.roundToNearestPixel(size.minHeight) : size.minHeight,
    maxWidth: size.maxWidth,
    maxHeight: size.maxHeight,
  })
}

const outlineStyleAdapter = (
  outline?: ContainerStyle['outline']
): OptionalViewStyle<
  | 'outlineColor'
  | 'outlineOffset'
  | 'outlineWidth'
  | 'outlineStyle'
> | undefined => {
  if (outline === undefined) {
    return undefined
  }

  return defined({
    outlineColor: outline.color,
    outlineOffset: outline.offset,
    outlineWidth: outline.width,
    outlineStyle: outline.style,
  })
}

const layoutStyleAdapter = (
  layout?: ContainerLayout
): OptionalViewStyle<
  | 'flexWrap'
  | 'flexGrow'
  | 'flexShrink'
  | 'flexBasis'
  | 'flexDirection'
  | 'justifyContent'
  | 'alignItems'
  | 'alignContent'
  | 'alignSelf'
  | 'gap'
> | undefined => {
  if (layout === undefined) {
    return undefined
  }

  return defined({
    flexWrap: layout.flexWrap,
    flexGrow: layout.flexGrow,
    flexShrink: layout.flexShrink,
    flexBasis: layout.flexBasis,
    flexDirection: flexDirectionStyleAdapter(layout.direction),
    justifyContent: justifyContentStyleAdapter(layout.mainAxisAlignment),
    alignItems: alignItemsStyleAdapter(layout.crossAxisAlignment),
    alignContent: alignContentStyleAdapter(layout.crossAxisLineAlignment),
    alignSelf: alignSelfStyleAdapter(layout.selfCrossAxisAlignment),
    gap: layout.gap,
  })
}

const positionStyleAdapter = (
  position?: Positioning
): OptionalViewStyle<
  | 'position'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'zIndex'
> | undefined => {
  if (position === undefined) {
    return undefined
  }

  if (position.type === 'static') {
    return defined({
      position: position.type,
      zIndex: position.zIndex,
    })
  }

  return defined({
    position: position.type,
    left: position.left,
    right: position.right,
    top: position.top,
    bottom: position.bottom,
    zIndex: position.zIndex,
  })
}

const transformStyleAdapter = (
  transform?: Transform
): ViewStyle['transform'] | undefined => {
  if (transform === undefined) {
    return undefined
  }

  const transforms = []

  if (transform.translate?.x !== undefined) {
    transforms.push({ translateX: transform.translate.x })
  }

  if (transform.translate?.y !== undefined) {
    transforms.push({ translateY: transform.translate.y })
  }

  if (transform.scale?.x !== undefined) {
    transforms.push({ scaleX: transform.scale.x })
  }

  if (transform.scale?.y !== undefined) {
    transforms.push({ scaleY: transform.scale.y })
  }

  if (transform.rotation?.x !== undefined) {
    transforms.push({ rotateX: transform.rotation.x })
  }

  if (transform.rotation?.y !== undefined) {
    transforms.push({ rotateY: transform.rotation.y })
  }

  if (transform.rotation?.z !== undefined) {
    transforms.push({ rotateZ: transform.rotation.z })
  }

  if (transform.skew?.x !== undefined) {
    transforms.push({ skewX: `${transform.skew.x}deg` })
  }

  if (transform.skew?.y !== undefined) {
    transforms.push({ skewY: `${transform.skew.y}deg` })
  }

  if (transforms.length === 0) {
    return undefined
  }

  return transforms
}

function containerStyleAdapter(tokens: ContainerStyle): ViewStyle {
  if (tokens === undefined) {
    return {}
  }

  return defined({
    display: 'flex' as ViewStyle['display'],
    overflow: tokens.overflow,
    backgroundColor: tokens.backgroundColor,
    opacity: tokens.opacity,
    boxShadow: shadowStyleAdapter(tokens.shadow),
    transform: transformStyleAdapter(tokens.transform),
    ...positionStyleAdapter(tokens.position),
    ...layoutStyleAdapter(tokens.layout),
    ...sizeStyleAdapter(tokens.size),
    ...borderStyleAdapter(tokens.border),
    ...borderRadiusStyleAdapter(tokens.borderRadius),
    ...paddingStyleAdapter(tokens.padding),
    ...marginStyleAdapter(tokens.margin),
    ...outlineStyleAdapter(tokens.outline),
  })
}

function textStyleAdapter(tokens: DesignTextStyle): TextStyle {
  if (tokens === undefined) {
    return {}
  }

  return defined({
    color: tokens.color,
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight as TextStyle['fontWeight'],
    fontFamily: tokens.fontFamily,
    lineHeight: tokens.lineHeight,
    textAlign: tokens.textAlign,
  })
}

function iconStyleAdapter(tokens: DesignIconStyle): IconStyle {
  if (tokens === undefined) {
    return {}
  }

  return defined({
    color: tokens.color,
    size: tokens.size,
    strokeWidth: tokens.strokeWidth,
  })
}

export const StyleAdapterUtils = {
  shadow: shadowStyleAdapter,
  flexDirection: flexDirectionStyleAdapter,
  justifyContent: justifyContentStyleAdapter,
  alignItems: alignItemsStyleAdapter,
  alignSelf: alignSelfStyleAdapter,
  alignContent: alignContentStyleAdapter,
  borderRadius: borderRadiusStyleAdapter,
  borderWidth: borderWidthStyleAdapter,
  borderColor: borderColorStyleAdapter,
  border: borderStyleAdapter,
  padding: paddingStyleAdapter,
  margin: marginStyleAdapter,
  size: sizeStyleAdapter,
  outline: outlineStyleAdapter,
  layout: layoutStyleAdapter,
  position: positionStyleAdapter,
  transform: transformStyleAdapter,
  container: containerStyleAdapter,
  text: textStyleAdapter,
  icon: iconStyleAdapter,
  stylePropResolver: getStyleProperty
}

export type StyleAdapters = typeof StyleAdapterUtils
