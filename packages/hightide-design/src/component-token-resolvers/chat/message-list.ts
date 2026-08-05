import type { ColorToken } from '../../primitive-tokens/color'
import type { ComponentTokenResolver } from '../component-token-resolver'

export type ChatMessageListTokens = {
  container: {
    flex: number,
    paddingVertical: number,
    paddingHorizontal: number,
    gap: number,
    backgroundColor: ColorToken,
  },
}

export type ChatMessageListTokenResolver = ComponentTokenResolver<
  Record<string, never>,
  ChatMessageListTokens
>

export const chatMessageListTokenResolver: ChatMessageListTokenResolver = ({ themeTokens }) => {
  const { color, spacing, shape } = themeTokens

  return {
    container: {
      flex: 1,
      paddingVertical: spacing.lg + spacing.xs,
      paddingHorizontal: spacing.lg,
      gap: shape.padding.xxl,
      backgroundColor: color.background.color,
    },
  }
}
