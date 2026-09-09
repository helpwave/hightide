import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import {
  stateful,
  tokenCalc,
  createTokenVariable,
  tokenValue
} from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import {
  type InputState,
  type InputTokens
} from './input-tokens'
import type { ComponentTokenConfig } from './token-config'
import type { TokenContext } from './token-context'

export type SearchBarState = InputState

export type SearchBarComponentResolverProps = {
  overrides?: {
    color?: ColorPairToken,
  },
  state: SearchBarState,
}

export type SearchBarTokens = {
  container: ContainerTokens,
  input: InputTokens,
  iconButton: ContainerTokens,
  icon: IconTokens,
}

export type SearchBarTokenResolver = ComponentTokenResolver<
  SearchBarComponentResolverProps,
  SearchBarTokens
>

export type SearchBarParams = {
  iconButtonSize: number,
}
export type SearchBarTokenContext = TokenContext<SearchBarParams>

const tokenVariable = createTokenVariable<SearchBarParams>()

export const searchBarTokens = {
  container: {
    size: stateful({
      width: '100%',
    }),
  },
  iconButton: {
    size: stateful({
      width: tokenVariable('params.iconButtonSize'),
      height: tokenVariable('params.iconButtonSize'),
    }),
    margin: stateful({
      type: 'physicalAxis',
      horizontal: tokenCalc(
        'divide',
        tokenCalc(
          'subtract',
          tokenVariable('theme.size.md'),
          tokenVariable('theme.size.sm')
        ),
        tokenValue(2)
      ),
    }),
  },
  icon: {
    color: stateful(tokenVariable('theme.color.surface.onColor')),
  },
} as const satisfies ComponentTokenConfig<SearchBarTokens, SearchBarTokenContext>
