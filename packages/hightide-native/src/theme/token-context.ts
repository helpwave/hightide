import type { TokenResolveContext } from '@helpwave/hightide-design/resolver'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'
import { semanticTokens } from '@helpwave/hightide-design/semantic-tokens'
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

const setFlag = (
  config: Record<string, string | undefined>,
  key: string,
  enabled: boolean | undefined
) => {
  if (enabled) {
    config[key] = 'true'
  }
}

export const mergeConfig = (
  ...parts: Array<Record<string, string | undefined> | undefined>
): Record<string, string | undefined> => {
  const config: Record<string, string | undefined> = {}

  for (const part of parts) {
    if (part === undefined) {
      continue
    }

    for (const [key, value] of Object.entries(part)) {
      if (value !== undefined) {
        config[key] = value
      }
    }
  }

  return config
}

export const interactionConfig = (
  state: InteractionState = {},
  extra: readonly string[] = []
): Record<string, string | undefined> => {
  const config: Record<string, string | undefined> = {}

  setFlag(config, 'disabled', state.isDisabled)
  setFlag(config, 'focused', state.isFocused)
  setFlag(config, 'focusVisible', state.isFocusVisible)
  setFlag(config, 'hovered', state.isHovered)
  setFlag(config, 'pressed', state.isPressed)
  setFlag(config, 'readonly', state.isReadonly)
  setFlag(config, 'invalid', state.isInvalid)

  for (const value of extra) {
    config[value] = 'true'
  }

  return config
}

export const interactionStateSet = interactionConfig

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
})
