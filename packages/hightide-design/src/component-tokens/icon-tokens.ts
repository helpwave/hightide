import type { ColorToken } from '../primitive-tokens/color'
import type { IconSize } from '../theme-tokens/theme-tokens-config'
import {
  stateful,
  createTokenVariable
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokenConfig } from './token-config'
import type { TokenContext } from './token-context'

export type IconParams = {
  size: number,
}
export type IconTokenContext = TokenContext<IconParams>

const tokenVariable = createTokenVariable<IconParams>()

export type IconComponentResolverProps = {
  overrides: {
    size?: IconSize,
  },
}

export type IconTokens = {
  size?: number,
  strokeWidth?: number,
  color?: ColorToken,
}

export type IconTokenConfig<
  S extends string = string,
  C extends Record<string, string> = Record<string, string>
> = ComponentTokenConfig<IconTokens, TokenContext<unknown>, S, C>

export type IconTokenResolver = ComponentTokenResolver<
  IconComponentResolverProps,
  IconTokens
>

export const iconTokens = {
  size: stateful(tokenVariable('params.size')),
  strokeWidth: stateful(tokenVariable('theme.icongraphy.strokeWidth')),
  color: stateful(tokenVariable('theme.color.primary.color')),
} as const satisfies ComponentTokenConfig<IconTokens, IconTokenContext>
