import type { ColorToken } from '../primitive-tokens/color'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { Resolvable } from './resolvable'
import {
  stateful,
  tokenPath,
  whenState
} from './builders'

export type DividerDirection = 'horizontal' | 'vertical'

export type DividerComponentResolverProps = {
  overrides?: {
    direction?: DividerDirection,
    color?: ColorToken,
    width?: number,
    margin?: number,
  },
}

export type DividerTokens = ContainerTokens

export type DividerTokenResolver = ComponentTokenResolver<
  DividerComponentResolverProps,
  DividerTokens
>

export const dividerTokens = {
  margin: stateful(
    {
      type: 'physicalAxis',
      horizontal: tokenPath('params.margin'),
      vertical: tokenPath('params.width'),
    },
    [
      whenState(['vertical'], {
        type: 'physicalAxis',
        vertical: tokenPath('params.margin'),
        horizontal: tokenPath('params.width'),
      }),
    ]
  ),
  border: stateful<string, Resolvable<NonNullable<ContainerTokens['border']>, string, string>>(
    {
      width: {
        type: 'physicalSide',
        bottom: tokenPath('params.width'),
      },
      color: {
        type: 'physicalSide',
        bottom: tokenPath('params.color'),
      },
      style: 'solid',
    },
    [
      whenState(['vertical'], {
        width: {
          type: 'physicalSide',
          right: tokenPath('params.width'),
        },
        color: {
          type: 'physicalSide',
          right: tokenPath('params.color'),
        },
        style: 'solid',
      }),
    ]
  ),
  layout: stateful(
    {
      selfCrossAxisAlignment: 'stretch',
    },
    [
      whenState(['vertical'], {}),
    ]
  ),
} as const
