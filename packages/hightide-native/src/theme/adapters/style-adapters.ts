import type { TextStyle, ViewStyle } from 'react-native'

import type { ContainerTokens } from '@helpwave/hightide-design/component-token-resolvers'
import type { TextStyleTokens } from '@helpwave/hightide-design/component-token-resolvers'
import type { ShadowToken } from '@helpwave/hightide-design/theme-tokens'

export const toShadowStyle = (shadow: ShadowToken): ViewStyle => ({
  shadowColor: shadow.color,
  shadowOffset: { width: shadow.x, height: shadow.y },
  shadowOpacity: 1,
  shadowRadius: shadow.blur,
  elevation: shadow.blur,
})

export const toContainerStyle = (tokens: ContainerTokens): ViewStyle => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
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
