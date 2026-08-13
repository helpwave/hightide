import type { TextStyle, ViewStyle } from 'react-native'

import type {
  AlignSelfToken,
  AxisAligmentToken,
  BorderRadiusToken,
  BorderToken,
  ContainerTokens,
  DirectionalToken,
  LayoutDirectionToken,
  MarginToken,
  PaddingToken,
  TextStyleTokens
} from '@helpwave/hightide-design/component-token-resolvers'
import {
  defaultWritingMode,
  resolveDirectionalTokens
} from '@helpwave/hightide-design/component-token-resolvers'
import type { ColorToken, HexColorToken } from '@helpwave/hightide-design/primitive-tokens'
import type { ShadowToken } from '@helpwave/hightide-design/theme-tokens'
import { HexColorUtils } from '@helpwave/hightide-design/utils'

export const toShadowStyle = (shadow: ShadowToken): ViewStyle => ({
  shadowColor: shadow.color,
  shadowOffset: { width: shadow.x, height: shadow.y },
  shadowOpacity: 1,
  shadowRadius: shadow.blur,
  elevation: shadow.blur,
})

const toFlexDirection = (
  direction?: LayoutDirectionToken
): NonNullable<ViewStyle['flexDirection']> => (
  direction === 'horizontal' ? 'row' : 'column'
)

const toJustifyContent = (
  alignment?: AxisAligmentToken
): NonNullable<ViewStyle['justifyContent']> => {
  if (alignment === 'start') {
    return 'flex-start'
  }

  if (alignment === 'end') {
    return 'flex-end'
  }

  return 'center'
}

const toAlignItems = (
  alignment?: AxisAligmentToken
): NonNullable<ViewStyle['alignItems']> => {
  if (alignment === 'start') {
    return 'flex-start'
  }

  if (alignment === 'end') {
    return 'flex-end'
  }

  return 'center'
}

const toAlignSelf = (
  alignment?: AlignSelfToken
): ViewStyle['alignSelf'] => {
  if (alignment === undefined) {
    return undefined
  }

  if (alignment === 'start') {
    return 'flex-start'
  }

  if (alignment === 'end') {
    return 'flex-end'
  }

  return alignment
}

const toBorderRadiusStyle = (
  borderRadius?: BorderRadiusToken
): ViewStyle => {
  if (borderRadius === undefined) {
    return {}
  }

  if (borderRadius.type === 'all') {
    return { borderRadius: borderRadius.value }
  }

  return {
    borderTopLeftRadius: borderRadius.topLeft,
    borderTopRightRadius: borderRadius.topRight,
    borderBottomLeftRadius: borderRadius.bottomLeft,
    borderBottomRightRadius: borderRadius.bottomRight,
  }
}

const toDirectionalBorderWidths = (
  width?: DirectionalToken<number>
): ViewStyle => {
  if (width === undefined) {
    return {}
  }

  switch (width.type) {
  case 'all':
    return {
      borderWidth: width.value,
    }
  case 'physicalAxis':
    return {
      borderTopWidth: width.vertical,
      borderBottomWidth: width.vertical,
      borderLeftWidth: width.horizontal,
      borderRightWidth: width.horizontal,
    }
  case 'physicalSide':
    return {
      borderTopWidth: width.top,
      borderRightWidth: width.right,
      borderBottomWidth: width.bottom,
      borderLeftWidth: width.left,
    }
  case 'logicalAxis':
    return {
      borderTopWidth: width.block,
      borderBottomWidth: width.block,
      borderStartWidth: width.inline,
      borderEndWidth: width.inline,
    }
  case 'logicalSide':
    return {
      borderStartWidth: width.inlineStart,
      borderEndWidth: width.inlineEnd,
      borderTopWidth: width.blockStart,
      borderBottomWidth: width.blockEnd,
    }
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
    return {
      borderColor: color.value,
    }
  case 'physicalAxis':
    return {
      borderTopColor: color.vertical,
      borderBottomColor: color.vertical,
      borderLeftColor: color.horizontal,
      borderRightColor: color.horizontal,
    }
  case 'physicalSide':
    return {
      borderTopColor: color.top,
      borderRightColor: color.right,
      borderBottomColor: color.bottom,
      borderLeftColor: color.left,
    }
  case 'logicalAxis':
    return {
      borderTopColor: color.block,
      borderBottomColor: color.block,
      borderStartColor: color.inline,
      borderEndColor: color.inline,
    }
  case 'logicalSide':
    return {
      borderStartColor: color.inlineStart,
      borderEndColor: color.inlineEnd,
      borderTopColor: color.blockStart,
      borderBottomColor: color.blockEnd,
    }
  }
}

const toBorderStyle = (border?: BorderToken): ViewStyle => {
  if (border === undefined) {
    return {}
  }

  return {
    ...toDirectionalBorderWidths(border.width),
    ...toDirectionalBorderColors(border.color),
    borderStyle: border.style,
  }
}

const toPaddingStyle = (padding?: PaddingToken): ViewStyle => {
  if (padding === undefined) {
    return {}
  }

  const sides = resolveDirectionalTokens([padding], defaultWritingMode)

  return {
    paddingTop: sides.top,
    paddingRight: sides.right,
    paddingBottom: sides.bottom,
    paddingLeft: sides.left,
  }
}

const toMarginStyle = (margin?: MarginToken): ViewStyle => {
  if (margin === undefined) {
    return {}
  }

  const sides = resolveDirectionalTokens([margin], defaultWritingMode)

  return {
    marginTop: sides.top,
    marginRight: sides.right,
    marginBottom: sides.bottom,
    marginLeft: sides.left,
  }
}

export const toContainerStyle = (tokens: ContainerTokens): ViewStyle => ({
  overflow: tokens.overflow,
  flexDirection: toFlexDirection(tokens.layout?.direction),
  justifyContent: toJustifyContent(tokens.layout?.mainAxisAlignment),
  alignItems: toAlignItems(tokens.layout?.crossAxisAligment),
  alignSelf: toAlignSelf(tokens.layout?.alignSelf),
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

export const toTextStyle = (tokens: TextStyleTokens): TextStyle => ({
  color: tokens.color,
  fontSize: tokens.fontSize,
  fontWeight: tokens.fontWeight,
  fontFamily: tokens.fontFamily,
  lineHeight: tokens.lineHeight,
  textAlign: tokens.textAlign,
  flex: tokens.flex,
  flexShrink: tokens.flexShrink,
})
