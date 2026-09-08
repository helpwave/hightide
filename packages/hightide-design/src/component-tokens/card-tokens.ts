import { stateful, tokenVariable, tokenValue } from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import { elevationTokens } from './elevation-tokens'
import type { ComponentTokenConfig } from './token-config'

export type CardTokens = ContainerTokens

export type CardTokenResolver = ComponentTokenResolver<
  object,
  CardTokens
>

export const cardTokens = {
  backgroundColor: stateful(tokenVariable('theme.color.surface.color')),
  borderRadius: stateful({
    type: 'all',
    value: tokenVariable('theme.borderRadius.lg'),
  }),
  layout: stateful({
    direction: 'vertical',
    crossAxisAlignment: 'stretch',
    mainAxisAlignment: 'start',
    gap: tokenValue(0),
  }),
  shadow: stateful(elevationTokens('level2')),
} as const satisfies ComponentTokenConfig<CardTokens>
