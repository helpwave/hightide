import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'
import type { SemanticTokenResolvers } from '@helpwave/hightide-design/semantic-token-resolvers'
import type {
  ComponentTokenResolvers,
  PressableState,
  PressableStateValue
} from '@helpwave/hightide-design/component-token-resolvers'

export type InteractionState = {
  isDisabled?: boolean,
  isHovered?: boolean,
  isFocused?: boolean,
  isFocusVisible?: boolean,
  isPressed?: boolean,
  isReadonly?: boolean,
  isInvalid?: boolean,
}

export const toPressableInteractionState = (
  state: InteractionState = {}
): PressableState => {
  const active = new Set<PressableStateValue>()

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

  return active
}

export type StyleOverwrite<TState, TStyle> =
  TStyle | ((state: TState, prev: TStyle) => TStyle)

export type StyleResolverFunction<TState, TStyle> = (
  props: TState,
  overwrite?: StyleOverwrite<TState, TStyle>,
) => TStyle

export type SimpleStyleResolver<TStyle> = StyleResolverFunction<Record<string, never>, TStyle>

export type ComponentThemeResolver<TTheme> = (params: {
  themeTokens: ThemeTokens,
  semanticTokens: SemanticTokenResolvers,
  componentTokens: ComponentTokenResolvers,
}) => TTheme

export const createStyleResolver = <TState, TStyle>(
  resolve: (props: TState) => TStyle
): StyleResolverFunction<TState, TStyle> => {
  return (props, overwrite) => {
    const base = resolve(props)

    if (overwrite === undefined) {
      return base
    }

    if (typeof overwrite === 'function') {
      return (overwrite as (state: TState, prev: TStyle) => TStyle)(props, base)
    }

    return [base, overwrite] as TStyle
  }
}

export const createSimpleStyleResolver = <TStyle>(
  resolve: () => TStyle
): SimpleStyleResolver<TStyle> => {
  return createStyleResolver<Record<string, never>, TStyle>(resolve)
}

export const createValueResolver = <TState, TValue>(
  resolve: (props: TState) => TValue
): StyleResolverFunction<TState, TValue> => {
  return (props, overwrite) => {
    const base = resolve(props)

    if (overwrite === undefined) {
      return base
    }

    if (typeof overwrite === 'function') {
      return (overwrite as (state: TState, prev: TValue) => TValue)(props, base)
    }

    return overwrite
  }
}

export const createSimpleValueResolver = <TValue>(
  resolve: () => TValue
): SimpleStyleResolver<TValue> => {
  return createValueResolver<Record<string, never>, TValue>(resolve)
}
