import type { ColorToken } from '../primitive-tokens/color'
import type { IconSize } from '../theme-tokens/theme-tokens-config'
import { stateful, tokenPath } from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'

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

export type IconTokenResolver = ComponentTokenResolver<
  IconComponentResolverProps,
  IconTokens
>

export const iconTokens = {
  size: stateful(tokenPath('params.size')),
  strokeWidth: stateful(tokenPath('theme.icongraphy.strokeWidth')),
  color: stateful(tokenPath('theme.color.primary.color')),
} as const
