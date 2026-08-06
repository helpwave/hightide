import type { TextStyle, ViewStyle } from 'react-native'

import type {
  AxisAligmentToken,
  ContainerTokens,
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

export const toContainerStyle = (tokens: ContainerTokens): ViewStyle => ({
  flexDirection: toFlexDirection(tokens.layout?.direction),
  justifyContent: toJustifyContent(tokens.layout?.mainAxisAlignment),
  alignItems: toAlignItems(tokens.layout?.crossAxisAligment),
  backgroundColor: tokens.backgroundColor,
  borderWidth: tokens.border?.width,
  borderColor: tokens.border?.color,
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
  ...(tokens.decoration?.shadow ? toShadowStyle(tokens.decoration.shadow) : {}),
})

export const toTextStyle = (tokens: TextStyleTokens): TextStyle => ({
  color: tokens.color,
  fontSize: tokens.fontSize,
  fontWeight: tokens.fontWeight,
  fontFamily: tokens.fontFamily,
  lineHeight: tokens.lineHeight,
})
