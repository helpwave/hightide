import { TokenBuilder } from '../../utils'
import type { AssertAssignable, HightideResolverConfig, NumberValueToken, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import type { ColorPairToken } from '../../theme-tokens/create'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ContainerTokens } from '../container-tokens'
import type { IconTokens } from '../icon-tokens'
import {
  type InputState,
  type InputStateValue,
  type InputConfig,
  type InputTokens
} from './input-tokens'
import type { HightideTokenPathProvider } from './token-context'

export type SearchBarState = InputState
export type SearchBarConfig = InputConfig

export type SearchBarComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
  state: ReadonlySet<InputStateValue>,
}

export type SearchBarTokens = AssertAssignable<{
  container: ContainerTokens,
  input: InputTokens,
  iconButton: ContainerTokens,
  icon: IconTokens,
}, ComponentTokens<SearchBarState, SearchBarConfig>>

export type SearchBarTokenResolver = ComponentTokenResolver<
  SearchBarComponentResolverProps,
  SearchBarTokens
>

export type SearchBarParams = AssertAssignable<{
  numbers: {
    iconButtonSize: NumberValueToken,
  },
}, HightideResolverParams>
export type SearchBarTokenContext = HightideTokenPathProvider<SearchBarParams>

export const searchBarTokens = {
  container: {
    type: 'container',
    size: TokenBuilder.stateful({
      width: TokenBuilder.percent('100%'),
    }),
  },
  iconButton: {
    type: 'container',
    size: TokenBuilder.stateful({
      width: TokenBuilder.numberRef<SearchBarTokenContext>('params.numbers.iconButtonSize'),
      height: TokenBuilder.numberRef<SearchBarTokenContext>('params.numbers.iconButtonSize'),
    }),
    margin: TokenBuilder.margin({ horizontal: TokenBuilder.calc(
        'divide',
        TokenBuilder.calc(
          'subtract',
          TokenBuilder.numberRef<SearchBarTokenContext>('theme.size.md'),
          TokenBuilder.numberRef<SearchBarTokenContext>('theme.size.sm')
        ),
        TokenBuilder.numberValue(TokenBuilder.number(2))
      ) }),
  },
  icon: {
    type: 'icon',
    color: TokenBuilder.stateful(TokenBuilder.colorValueRef<SearchBarTokenContext>('theme.color.surface.onColor')),
  },
} as const
