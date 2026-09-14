import { TokenBuilder } from '../../utils'
import type { AssertAssignable, HightideResolverConfig, NumberToken, HightideResolverParams, ResolverState } from '../../primitive-tokens'
import type { ColorPairToken } from '../../theme-tokens/create'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ComponentTokens } from '../component-tokens'
import type { ResolvableContainerTokens } from '../resolvable-container-tokens'
import type { ResolvableIconTokens } from '../resolvable-icon-tokens'
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
  container: ResolvableContainerTokens<SearchBarState, SearchBarConfig>,
  input: InputTokens,
  iconButton: ResolvableContainerTokens<SearchBarState, SearchBarConfig>,
  icon: ResolvableIconTokens<SearchBarState, SearchBarConfig>,
}, ComponentTokens<SearchBarState, SearchBarConfig>>

export type SearchBarTokenResolver = ComponentTokenResolver<
  SearchBarComponentResolverProps,
  SearchBarTokens
>

export type SearchBarParams = AssertAssignable<{
  numbers: {
    iconButtonSize: NumberToken,
  },
}, HightideResolverParams>
export type SearchBarTokenContext = HightideTokenPathProvider<SearchBarParams>

export const searchBarTokens = {
  container: {
    kind: 'container' as const,
    size: TokenBuilder.stateful({
      width: TokenBuilder.percent('100%'),
    }),
  },
  iconButton: {
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
        TokenBuilder.number(2)
      ) }),
  },
  icon: {
    kind: 'icon' as const,
    color: TokenBuilder.stateful(TokenBuilder.colorRef<SearchBarTokenContext>('theme.color.surface.onColor')),
  },
} as const
