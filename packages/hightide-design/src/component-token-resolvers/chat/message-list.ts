import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'

export type ChatMessageListTokens = {
  container: ContainerTokens,
}

export type ChatMessageListTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatMessageListTokens
>

export const chatMessageListTokenResolver: ChatMessageListTokenResolver = ({ themeTokens }) => {
  const { color, spacing, shape } = themeTokens

  return {
    container: {
      backgroundColor: color.background.color,
      padding: {
        type: 'physicalAxis',
        vertical: spacing.lg + spacing.xs,
        horizontal: spacing.lg,
      },
      layout: {
        gap: shape.padding.xxl,
      },
    },
  }
}
