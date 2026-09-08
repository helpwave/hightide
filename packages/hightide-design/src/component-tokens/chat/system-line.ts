import type { ColorToken } from '../../primitive-tokens/color'
import type { ColorPairToken } from '../../theme-tokens/theme-tokens-config'
import type { ComponentTokenResolver } from '../component-token-resolver'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import type { TextStyleTokens } from '../text-style-tokens'
import {
  stateful,
  createTokenVariable
} from '../builders'
import type { ComponentTokenConfig } from '../token-config'
import type { TokenContext } from '../token-context'

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

export type ChatSystemLineParams = {
  accentForeground: ColorToken,
}
export type ChatSystemLineTokenContext = TokenContext<ChatSystemLineParams>

const tokenVariable = createTokenVariable<ChatSystemLineParams>()

export const chatSystemLineTokens = {
  container: {
    layout: stateful({
      direction: 'horizontal',
      mainAxisAlignment: 'center',
      crossAxisAlignment: 'center',
      selfCrossAxisAlignment: 'center',
      gap: tokenVariable('theme.padding.md'),
    }),
  },
  text: {
    fontSize: stateful(tokenVariable('theme.typography.body.sm.fontSize')),
    fontFamily: stateful(tokenVariable('theme.typography.body.sm.fontFamily')),
    lineHeight: stateful(tokenVariable('theme.typography.body.sm.lineHeight')),
    fontWeight: stateful(tokenVariable('theme.fontWeights.medium')),
    color: stateful(tokenVariable('params.accentForeground')),
  },
  icon: {
    color: stateful(tokenVariable('params.accentForeground')),
  },
} as const satisfies ComponentTokenConfig<ChatSystemLineTokens, ChatSystemLineTokenContext>
