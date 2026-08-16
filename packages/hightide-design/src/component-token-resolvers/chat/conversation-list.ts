import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'

export type ChatConversationListTokens = {
  container: ContainerTokens,
  header: ContainerTokens,
  footer: ContainerTokens,
}

export type ChatConversationListTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatConversationListTokens
>

export const chatConversationListTokenResolver: ChatConversationListTokenResolver = ({ themeTokens }) => {
  const { color, spacing, shape } = themeTokens

  return {
    container: {
      backgroundColor: color.surface.color,
      layout: {
        direction: 'vertical'
      }
    },
    header: {
      padding: {
        type: 'physicalAxis',
        vertical: spacing.lg,
        horizontal: spacing.lg,
      },
      layout: {
        gap: shape.padding.xl,
      },
    },
    footer: {
      padding: {
        type: 'physicalAxis',
        vertical: spacing.md,
        horizontal: spacing.lg,
      },
    },
  }
}
