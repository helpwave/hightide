import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { ComponentTokenConfig } from '../token-config'
import { stateful, tokenVariable } from '../builders'

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
    backgroundColor: stateful(tokenVariable('theme.color.surface.color')),
    layout: stateful({
      direction: 'vertical',
    }),
  },
  header: {
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenVariable('theme.spacing.lg'),
      horizontal: tokenVariable('theme.spacing.lg'),
    }),
    layout: stateful({
      gap: tokenVariable('theme.padding.xl'),
    }),
  },
  footer: {
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenVariable('theme.spacing.md'),
      horizontal: tokenVariable('theme.spacing.lg'),
    }),
  },
} as const satisfies ComponentTokenConfig<ChatConversationListTokens>
