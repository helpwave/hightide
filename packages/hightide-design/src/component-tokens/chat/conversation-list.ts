import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import { stateful, tokenPath } from '../builders'

export type ChatConversationListTokens = {
  container: ContainerTokens,
  header: ContainerTokens,
  footer: ContainerTokens,
}

export type ChatConversationListTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatConversationListTokens
>

export const chatConversationListTokens = {
  container: {
    backgroundColor: stateful(tokenPath('theme.color.surface.color')),
    layout: stateful({
      direction: 'vertical',
    }),
  },
  header: {
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenPath('theme.spacing.lg'),
      horizontal: tokenPath('theme.spacing.lg'),
    }),
    layout: stateful({
      gap: tokenPath('theme.padding.xl'),
    }),
  },
  footer: {
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenPath('theme.spacing.md'),
      horizontal: tokenPath('theme.spacing.lg'),
    }),
  },
} as const
