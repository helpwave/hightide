import {
  buttonTokens,
  type ButtonTokenResolver,
  type ButtonTokens,
  type PressableButtonTokenParams,
  type PressableStateValue
} from '@helpwave/hightide-design/component-tokens'
import {
  semanticTokens,
  type ButtonTokenConfig,
  type ButtonVariant
} from '@helpwave/hightide-design/semantic-tokens'
import { resolveTokenConfig, type TokenResolveContext } from '../static-resolve/resolve'

type ButtonTokenState = PressableStateValue | ButtonVariant

type ButtonParams = Pick<PressableButtonTokenParams, 'colorPair'>

export const buttonTokenResolver: ButtonTokenResolver = ({
  themeTokens,
  overrides,
  state,
}) => {
  const size = overrides.size ?? 'md'
  const variant = overrides.variant ?? 'filled'
  const colorPair = overrides.color ?? themeTokens.color.primary
  const states = new Set<ButtonTokenState>([...state, variant])
  const params: ButtonParams = {
    colorPair,
  }
  const config: ButtonTokenConfig = {
    variant,
    size,
  }
  const context: TokenResolveContext = {
    theme: themeTokens,
    semantics: semanticTokens,
    params,
    config,
    state: states,
  }

  return resolveTokenConfig<ButtonTokens>(
    buttonTokens,
    states,
    context
  )
}
