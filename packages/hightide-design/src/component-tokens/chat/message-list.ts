import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import {
  stateful,
  tokenCalc,
  tokenPath
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
    backgroundColor: stateful(tokenPath('theme.color.background.color')),
    padding: stateful({
      type: 'physicalAxis',
      vertical: tokenCalc(
        'add',
        tokenPath('theme.spacing.lg'),
        tokenPath('theme.spacing.xs')
      ),
      horizontal: tokenPath('theme.spacing.lg'),
    }),
    layout: stateful({
      gap: tokenPath('theme.padding.xl'),
    }),
  },
} as const
