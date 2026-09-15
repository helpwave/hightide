import {
  buttonTokens,
  type ButtonParams,
  type ButtonTokenResolver,
  type PressableStateValue
} from '@helpwave/hightide-design/component-tokens'
import {
  semanticTokens,
  type ButtonTokenConfig,
  type ButtonVariant
} from '@helpwave/hightide-design/semantic-tokens'
import {
  resolveContainerTokenConfig,
  resolveIconTokenConfig,
  resolveTextStyleTokenConfig,
  type TokenResolveContext
} from '@helpwave/hightide-design/component-tokens'

type ButtonTokenState = PressableStateValue | ButtonVariant

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
    colors: {
      color: colorPair.color,
      onColor: colorPair.onColor,
    },
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

  return {
    container: resolveContainerTokenConfig(buttonTokens.container, context),
    stateLayer: resolveContainerTokenConfig(buttonTokens.stateLayer, context),
    icon: resolveIconTokenConfig(buttonTokens.icon, context),
    text: resolveTextStyleTokenConfig(buttonTokens.text, context),
  }
}
