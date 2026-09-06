import { stateful, tokenPath, tokenValue } from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'

export type CardTokens = ContainerTokens

export type CardTokenResolver = ComponentTokenResolver<
  object,
  CardTokens
>

export const cardTokens = {
  backgroundColor: stateful(tokenPath('theme.color.surface.color')),
  borderRadius: stateful({
    type: 'all',
    value: tokenPath('theme.borderRadius.lg'),
  }),
  layout: stateful({
    direction: 'vertical',
    crossAxisAlignment: 'stretch',
    mainAxisAlignment: 'start',
    gap: tokenValue(0),
  }),
  shadow: stateful(tokenPath('theme.elevation.level2')),
} as const
