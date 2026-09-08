import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { ComponentTokenConfig } from '../token-config'
import {
  stateful,
  tokenCalc,
  tokenVariable
} from '../builders'

export type ChatMessageListTokens = {
  container: ContainerTokens,
}

export type ChatMessageListTokenResolver = ComponentTokenResolver<
  Record<string, unknown>,
  ChatMessageListTokens
>

export const chatMessageListTokens = {
  container: {
    backgroundColor: stateful(tokenVariable('theme.color.background.color')),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenCalc(
        'add',
        tokenVariable('theme.spacing.lg'),
        tokenVariable('theme.spacing.xs')
      ),
      horizontal: tokenVariable('theme.spacing.lg'),
    }),
    layout: stateful({
      gap: tokenVariable('theme.padding.xl'),
    }),
  },
} as const satisfies ComponentTokenConfig<ChatMessageListTokens>
