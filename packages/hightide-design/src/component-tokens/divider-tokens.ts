import type { ColorToken } from '../primitive-tokens/color'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { ComponentTokenConfig, ComponentTokenConfigValue } from './token-config'
import type { TokenContext } from './token-context'
import {
  stateful,
  createTokenVariable,
  whenState,
  statefulField
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

export type DividerParams = {
  color: ColorToken,
  width: number,
  margin: number,
}
export type DividerTokenContext = TokenContext<DividerParams>

const tokenVariable = createTokenVariable<DividerParams>()

export type DividerTokenResolver = ComponentTokenResolver<
  DividerComponentResolverProps,
  DividerTokens
>

export const dividerTokens = {
  margin: statefulField<NonNullable<ContainerTokens['margin']>, DividerTokenContext>(
    {
      type: 'physicalAxis',
      horizontal: tokenVariable('params.margin'),
      vertical: tokenVariable('params.width'),
    },
    [
      whenState(['vertical'], {
        type: 'physicalAxis',
        vertical: tokenVariable('params.margin'),
        horizontal: tokenVariable('params.width'),
      }),
    ]
  ),
  border: stateful<string, ComponentTokenConfigValue<NonNullable<ContainerTokens['border']>, DividerTokenContext>>(
    {
      width: {
        type: 'physicalSide',
        bottom: tokenVariable('params.width'),
      },
      color: {
        type: 'physicalSide',
        bottom: tokenVariable('params.color'),
      },
      style: 'solid',
    },
    [
      whenState(['vertical'], {
        width: {
          type: 'physicalSide',
          right: tokenVariable('params.width'),
        },
        color: {
          type: 'physicalSide',
          right: tokenVariable('params.color'),
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
} as const satisfies ComponentTokenConfig<DividerTokens, DividerTokenContext>
