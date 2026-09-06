import type { ColorPairToken } from '../theme-tokens/theme-tokens-config'
import { stateful, tokenCalc, tokenPath, tokenValue } from './builders'
import type { ComponentTokenResolver } from './component-token-resolver'
import type { ContainerTokens } from './container-tokens'
import type { IconTokens } from './icon-tokens'
import {
  type InputState,
  type InputTokens
} from './input-tokens'

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

export const searchBarTokens = {
  container: {
    size: stateful({
      width: '100%',
    }),
  },
  iconButton: {
    size: stateful({
      width: tokenPath('params.iconButtonSize'),
      height: tokenPath('params.iconButtonSize'),
    }),
    margin: stateful({
      type: 'physicalAxis',
      horizontal: tokenCalc(
        'divide',
        tokenCalc(
          'subtract',
          tokenPath('theme.size.md'),
          tokenPath('theme.size.sm')
        ),
        tokenValue(2)
      ),
    }),
  },
  icon: {
    color: stateful(tokenPath('theme.color.surface.onColor')),
  },
} as const
