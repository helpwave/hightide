import {
  StyleSheet,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from 'react-native'

import type {
  AxisAligmentToken,
  BorderRadiusToken,
  BorderToken,
  ContainerTokens,
  CrossAxisAligmentToken,
  CrossAxisLineAligmentToken,
  IconTokens,
  LayoutDirectionToken,
  MainAxisAligmentToken,
  MarginToken,
  PaddingToken,
  TextStyleTokens
} from '@helpwave/hightide-design/component-token-resolvers'
import {
  defaultWritingMode,
  resolveDirectionalTokens
} from '@helpwave/hightide-design/component-token-resolvers'
import type { ShadowToken } from '@helpwave/hightide-design/theme-tokens'
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
  alignment: AxisAligmentToken
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
  shadow?: SingleOrArray<ShadowToken>
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
  direction?: LayoutDirectionToken
): ViewStyle['flexDirection'] | undefined => {
  if (direction === undefined) {
    return undefined
  }

  return direction === 'horizontal' ? 'row' : 'column'
}

const justifyContentStyleAdapter = (
  alignment?: MainAxisAligmentToken
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
  alignment?: CrossAxisAligmentToken
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
  alignment?: CrossAxisAligmentToken
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
  alignment?: CrossAxisLineAligmentToken
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
  borderRadius?: BorderRadiusToken
): OptionalViewStyle<
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderBottomLeftRadius'
  | 'borderBottomRightRadius'
> | undefined => {
  if (borderRadius === undefined) {
    return undefined
  }

  if (borderRadius.type === 'all') {
    return {
      borderTopLeftRadius:  borderRadius.value,
      borderTopRightRadius:  borderRadius.value,
      borderBottomLeftRadius:  borderRadius.value,
      borderBottomRightRadius:  borderRadius.value,
    }
  }

  return defined({
    borderTopLeftRadius: borderRadius.topLeft,
    borderTopRightRadius: borderRadius.topRight,
    borderBottomLeftRadius: borderRadius.bottomLeft,
    borderBottomRightRadius: borderRadius.bottomRight,
  })
}

const borderWidthStyleAdapter = (
  width?: BorderToken['width']
): OptionalViewStyle<
  | 'borderTopWidth'
  | 'borderRightWidth'
  | 'borderBottomWidth'
  | 'borderLeftWidth'
> | undefined => {
  if (width === undefined) {
    return undefined
  }

  const sides = resolveDirectionalTokens([width], defaultWritingMode)

  return defined({
    borderTopWidth: sides.top,
    borderRightWidth: sides.right,
    borderBottomWidth: sides.bottom,
    borderLeftWidth: sides.left,
  })
}

const borderColorStyleAdapter = (
  color?: BorderToken['color']
): OptionalViewStyle<
  | 'borderTopColor'
  | 'borderRightColor'
  | 'borderBottomColor'
  | 'borderLeftColor'
> | undefined => {
  if (color === undefined) {
    return undefined
  }

  const sides = resolveDirectionalTokens([color], defaultWritingMode)

  return defined({
    borderTopColor: sides.top,
    borderRightColor: sides.right,
    borderBottomColor: sides.bottom,
    borderLeftColor: sides.left,
  })
}

const borderStyleAdapter = (
  border?: BorderToken
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
  padding?: PaddingToken
): OptionalViewStyle<
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'
> | undefined => {
  if (padding === undefined) {
    return undefined
  }

  const sides = resolveDirectionalTokens([padding], defaultWritingMode)

  return defined({
    paddingTop: sides.top,
    paddingRight: sides.right,
    paddingBottom: sides.bottom,
    paddingLeft: sides.left,
  })
}

const marginStyleAdapter = (
  margin?: MarginToken
): OptionalViewStyle<
  | 'marginTop'
  | 'marginRight'
  | 'marginBottom'
  | 'marginLeft'
> | undefined => {
  if (margin === undefined) {
    return undefined
  }

  const sides = resolveDirectionalTokens([margin], defaultWritingMode)

  return defined({
    marginTop: sides.top,
    marginRight: sides.right,
    marginBottom: sides.bottom,
    marginLeft: sides.left,
  })
}

const sizeStyleAdapter = (
  size?: ContainerTokens['size']
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
    minHeight: size.minHeight,
    maxWidth: size.maxWidth,
    maxHeight: size.maxHeight,
  })
}

const outlineStyleAdapter = (
  outline?: ContainerTokens['outline']
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
  layout?: ContainerTokens['layout']
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
    alignItems: alignItemsStyleAdapter(layout.crossAxisAligment),
    alignContent: alignContentStyleAdapter(layout.crossAxisLineAligment),
    alignSelf: alignSelfStyleAdapter(layout.selfCrossAxisAlignment),
    gap: layout.gap,
  })
}

function containerStyleAdapter(tokens: ContainerTokens): ViewStyle {
  if (tokens === undefined) {
    return {}
  }

  return defined({
    display: 'flex' as ViewStyle['display'],
    overflow: tokens.overflow,
    backgroundColor: tokens.backgroundColor,
    opacity: tokens.opacity,
    boxShadow: shadowStyleAdapter(tokens.decoration?.shadow),
    ...layoutStyleAdapter(tokens.layout),
    ...sizeStyleAdapter(tokens.size),
    ...borderStyleAdapter(tokens.border),
    ...borderRadiusStyleAdapter(tokens.shape?.borderRadius),
    ...paddingStyleAdapter(tokens.padding),
    ...marginStyleAdapter(tokens.margin),
    ...outlineStyleAdapter(tokens.outline),
  })
}

function textStyleAdapter(tokens: TextStyleTokens): TextStyle {
  if (tokens === undefined) {
    return {}
  }

  return defined({
    color: tokens.color,
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight,
    fontFamily: tokens.fontFamily,
    lineHeight: tokens.lineHeight,
    textAlign: tokens.textAlign,
  })
}

function iconStyleAdapter(tokens: IconTokens): IconStyle {
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
  container: containerStyleAdapter,
  text: textStyleAdapter,
  icon: iconStyleAdapter,
  stylePropResolver: getStyleProperty
}

export type StyleAdapters = typeof StyleAdapterUtils
