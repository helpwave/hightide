import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  stateful,
  tokenPath
} from '../builders'

export type ChatSystemLineComponentResolverProps = {
  overrides: {
    color?: ColorPairToken,
  },
}

export type ChatSystemLineTokens = {
  container: ContainerTokens,
  text: TextStyleTokens,
  icon: IconTokens,
}

export type ChatSystemLineTokenResolver = ComponentTokenResolver<
  ChatSystemLineComponentResolverProps,
  ChatSystemLineTokens
>

export const chatSystemLineTokens = {
  container: {
    layout: stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
      selfCrossAxisAlignment: 'center',
      gap: tokenPath('theme.padding.md'),
    }),
  },
  text: {
    fontSize: stateful(tokenPath('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenPath('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenPath('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenPath('theme.fontWeights.medium')),
    color: stateful(tokenPath('params.accentForeground')),
  },
  icon: {
    color: stateful(tokenPath('params.accentForeground')),
  },
} as const
