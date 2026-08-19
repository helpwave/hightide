import type { ViewStyle } from 'react-native'

import type {
  AxisAligmentToken,
  BorderRadiusToken,
  BorderToken,
  ContainerTokens,
  CrossAxisAligmentToken,
  CrossAxisLineAligmentToken,
  DirectionalToken,
  LayoutDirectionToken,
  MainAxisAligmentToken,
  MarginToken,
  PaddingToken
} from '@helpwave/hightide-design/component-token-resolvers'
import {
  defaultWritingMode,
  resolveDirectionalTokens
} from '@helpwave/hightide-design/component-token-resolvers'
import type { ColorToken, HexColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type { ShadowToken } from '@helpwave/hightide-design/theme-tokens'
import { HexColorUtils } from '@helpwave/hightide-design/utils'

import { defined } from './defined'

export const toShadowStyle = (shadow: ShadowToken): ViewStyle => defined({
  boxShadow: [{
    color: shadow.color,
    offsetX: shadow.x,
    offsetY: shadow.y,
    blurRadius: shadow.blur,
    spreadDistance: shadow.spread,
  }],
})

const toFlexDirection = (
  direction?: LayoutDirectionToken
): ViewStyle['flexDirection'] => {
  if (direction === undefined) {
    return undefined
  }

  return direction === 'horizontal' ? 'row' : 'column'
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

const toJustifyContent = (
  alignment?: MainAxisAligmentToken
): ViewStyle['justifyContent'] => {
  if (alignment === undefined) {
    return undefined
  }

  if (alignment === 'space-between' || alignment === 'space-evenly' || alignment === 'space-around') {
    return alignment
  }

  return toFlexStartEnd(alignment)
}

const toAlignItems = (
  alignment?: CrossAxisAligmentToken
): ViewStyle['alignItems'] => {
  if (alignment === undefined) {
    return undefined
  }

  if (alignment === 'stretch') {
    return alignment
  }

  return toFlexStartEnd(alignment)
}

const toAlignSelf = (
  alignment?: CrossAxisAligmentToken
): ViewStyle['alignSelf'] => {
  if (alignment === undefined) {
    return undefined
  }

  if (alignment === 'stretch') {
    return alignment
  }

  return toFlexStartEnd(alignment)
}

const toAlignContent = (
  alignment?: CrossAxisLineAligmentToken
): ViewStyle['alignContent'] => {
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

const toBorderRadiusStyle = (
  borderRadius?: BorderRadiusToken
): ViewStyle => {
  if (borderRadius === undefined) {
    return {}
  }

  if (borderRadius.type === 'all') {
    return defined({ borderRadius: borderRadius.value })
  }

  return defined({
    borderTopLeftRadius: borderRadius.topLeft,
    borderTopRightRadius: borderRadius.topRight,
    borderBottomLeftRadius: borderRadius.bottomLeft,
    borderBottomRightRadius: borderRadius.bottomRight,
  })
}

const toDirectionalBorderWidths = (
  width?: DirectionalToken<number>
): ViewStyle => {
  if (width === undefined) {
    return {}
  }

  switch (width.type) {
  case 'all':
    return defined({
      borderWidth: width.value,
    })
  case 'physicalAxis':
    return defined({
      borderTopWidth: width.vertical,
      borderBottomWidth: width.vertical,
      borderLeftWidth: width.horizontal,
      borderRightWidth: width.horizontal,
    })
  case 'physicalSide':
    return defined({
      borderTopWidth: width.top,
      borderRightWidth: width.right,
      borderBottomWidth: width.bottom,
      borderLeftWidth: width.left,
    })
  case 'logicalAxis':
    return defined({
      borderTopWidth: width.block,
      borderBottomWidth: width.block,
      borderStartWidth: width.inline,
      borderEndWidth: width.inline,
    })
  case 'logicalSide':
    return defined({
      borderStartWidth: width.inlineStart,
      borderEndWidth: width.inlineEnd,
      borderTopWidth: width.blockStart,
      borderBottomWidth: width.blockEnd,
    })
  }
}

const toDirectionalBorderColors = (
  color?: NonNullable<BorderToken['color']>
): ViewStyle => {
  if (color === undefined) {
    return {}
  }

  switch (color.type) {
  case 'all':
    return defined({
      borderColor: color.value,
    })
  case 'physicalAxis':
    return defined({
      borderTopColor: color.vertical,
      borderBottomColor: color.vertical,
      borderLeftColor: color.horizontal,
      borderRightColor: color.horizontal,
    })
  case 'physicalSide':
    return defined({
      borderTopColor: color.top,
      borderRightColor: color.right,
      borderBottomColor: color.bottom,
      borderLeftColor: color.left,
    })
  case 'logicalAxis':
    return defined({
      borderTopColor: color.block,
      borderBottomColor: color.block,
      borderStartColor: color.inline,
      borderEndColor: color.inline,
    })
  case 'logicalSide':
    return defined({
      borderStartColor: color.inlineStart,
      borderEndColor: color.inlineEnd,
      borderTopColor: color.blockStart,
      borderBottomColor: color.blockEnd,
    })
  }
}

const toBorderStyle = (border?: BorderToken): ViewStyle => {
  if (border === undefined) {
    return {}
  }

  return defined({
    ...toDirectionalBorderWidths(border.width),
    ...toDirectionalBorderColors(border.color),
    borderStyle: border.style,
  })
}

const toPaddingStyle = (padding?: PaddingToken): ViewStyle => {
  if (padding === undefined) {
    return {}
  }

  const sides = resolveDirectionalTokens([padding], defaultWritingMode)

  return defined({
    paddingTop: sides.top,
    paddingRight: sides.right,
    paddingBottom: sides.bottom,
    paddingLeft: sides.left,
  })
}

const toMarginStyle = (margin?: MarginToken): ViewStyle => {
  if (margin === undefined) {
    return {}
  }

  const sides = resolveDirectionalTokens([margin], defaultWritingMode)

  return defined({
    marginTop: sides.top,
    marginRight: sides.right,
    marginBottom: sides.bottom,
    marginLeft: sides.left,
  })
}

export const toContainerStyle = (tokens: ContainerTokens): ViewStyle => defined({
  display: 'flex',
  overflow: tokens.overflow,
  flexWrap: tokens.layout?.flexWrap,
  flexGrow: tokens.layout?.flexGrow,
  flexShrink: tokens.layout?.flexShrink,
  flexBasis: tokens.layout?.flexBasis,
  flexDirection: toFlexDirection(tokens.layout?.direction),
  justifyContent: toJustifyContent(tokens.layout?.mainAxisAlignment),
  alignItems: toAlignItems(tokens.layout?.crossAxisAligment),
  alignContent: toAlignContent(tokens.layout?.crossAxisLineAligment),
  alignSelf: toAlignSelf(tokens.layout?.selfCrossAxisAlignment),
  backgroundColor: tokens.backgroundColor,
  opacity: tokens.opacity,
  ...toBorderStyle(tokens.border),
  height: tokens.size?.height,
  width: tokens.size?.width,
  minHeight: tokens.size?.minHeight,
  minWidth: tokens.size?.minWidth,
  maxHeight: tokens.size?.maxHeight,
  maxWidth: tokens.size?.maxWidth,
  ...toBorderRadiusStyle(tokens.shape?.borderRadius),
  ...toPaddingStyle(tokens.padding),
  ...toMarginStyle(tokens.margin),
  gap: tokens.layout?.gap,
  outlineColor: tokens.outline?.color,
  outlineOffset: tokens.outline?.offset,
  outlineWidth: tokens.outline?.width,
  outlineStyle: tokens.outline?.style,
  ...(tokens.decoration?.shadow ? toShadowStyle(tokens.decoration.shadow) : {}),
})

const blendWithStateLayer = (
  base: ColorToken | undefined,
  tint: ColorToken
): ColorToken | undefined => {
  if (base === undefined || tint === 'transparent' || base === 'transparent') {
    return base
  }

  return HexColorUtils.blend(base as HexColorToken, tint as HexColorToken)
}

export const toContainerStyleWithStateLayer = (
  container: ContainerTokens,
  stateLayer?: ContainerTokens
): ViewStyle => {
  const tint = stateLayer?.backgroundColor ?? 'transparent'
  const borderColor = container.border?.color

  return toContainerStyle({
    ...container,
    backgroundColor: blendWithStateLayer(container.backgroundColor, tint),
    border: container.border === undefined ? undefined : {
      ...container.border,
      color: borderColor?.type === 'all'
        ? {
          type: 'all',
          value: blendWithStateLayer(borderColor.value, tint) ?? borderColor.value,
        }
        : borderColor,
    },
  })
}
