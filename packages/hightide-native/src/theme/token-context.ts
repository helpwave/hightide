import type { TokenResolveContext } from '@helpwave/hightide-design/resolver'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'
import { semanticTokens } from '@helpwave/hightide-design/semantic-tokens'
import type { PressableStateValue } from '@helpwave/hightide-design/component-tokens'
import { wrapParams, type TokenContextParams } from './token-params'

export type TokenContext = TokenResolveContext

export type { TokenContextParams }

export type TokenContextInput = Omit<TokenContext, 'theme' | 'semantics' | 'params'> & {
  theme?: TokenContext['theme'],
  semantics?: TokenContext['semantics'],
  params?: TokenContextParams,
}

export type InteractionState = {
  isDisabled?: boolean,
  isHovered?: boolean,
  isFocused?: boolean,
  isFocusVisible?: boolean,
  isPressed?: boolean,
  isReadonly?: boolean,
  isInvalid?: boolean,
}

export const bindTokenContext = (
  themeTokens: ThemeTokens,
  semanticsAst: object = semanticTokens
) => (
  input: TokenContextInput = {}
): TokenContext => ({
  theme: input.theme ?? themeTokens,
  semantics: input.semantics ?? semanticsAst,
  params: wrapParams(input.params),
  config: input.config,
  state: input.state,
})

export const interactionStateSet = (
  state: InteractionState = {},
  extra: readonly string[] = []
): Set<PressableStateValue | string> => {
  const active = new Set<PressableStateValue | string>()

  if (state.isDisabled) {
    active.add('disabled')
  }
  if (state.isFocused) {
    active.add('focused')
  }
  if (state.isFocusVisible) {
    active.add('focusVisible')
  }
  if (state.isHovered) {
    active.add('hovered')
  }
  if (state.isPressed) {
    active.add('pressed')
  }
  if (state.isReadonly) {
    active.add('readonly')
  }
  if (state.isInvalid) {
    active.add('invalid')
  }

  for (const value of extra) {
    active.add(value)
  }

  return active
}
