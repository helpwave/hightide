import type { TextStyle, ViewStyle } from 'react-native'

import type {
  AxisAligmentToken,
  BorderToken,
  ContainerTokens,
  DirectionalToken,
  LayoutDirectionToken,
  TextStyleTokens
} from '@helpwave/hightide-design/component-token-resolvers'
import type { ShadowToken } from '@helpwave/hightide-design/theme-tokens'

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
  direction === 'vertical' ? 'column' : 'row'
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

export const toContainerStyle = (tokens: ContainerTokens): ViewStyle => ({
  flexDirection: toFlexDirection(tokens.layout?.direction),
  justifyContent: toJustifyContent(tokens.layout?.mainAxisAlignment),
  alignItems: toAlignItems(tokens.layout?.crossAxisAligment),
  backgroundColor: tokens.backgroundColor,
  ...toBorderStyle(tokens.border),
  height: tokens.size?.height,
  width: tokens.size?.width,
  minHeight: tokens.size?.minHeight,
  minWidth: tokens.size?.minWidth,
  maxHeight: tokens.size?.maxHeight,
  maxWidth: tokens.size?.maxWidth,
  borderRadius: tokens.shape?.borderRadius,
  paddingVertical: tokens.shape?.padding?.vertical,
  paddingHorizontal: tokens.shape?.padding?.horizontal,
  gap: tokens.layout?.gap,
  outlineColor: tokens.outline?.color,
  outlineOffset: tokens.outline?.offset,
  outlineWidth: tokens.outline?.width,
  outlineStyle: tokens.outline?.style,
  ...(tokens.decoration?.shadow ? toShadowStyle(tokens.decoration.shadow) : {}),
})

export const toTextStyle = (tokens: TextStyleTokens): TextStyle => ({
  color: tokens.color,
  fontSize: tokens.fontSize,
  fontWeight: tokens.fontWeight,
  fontFamily: tokens.fontFamily,
  lineHeight: tokens.lineHeight,
})
