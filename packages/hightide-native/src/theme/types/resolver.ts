export type InteractionState = {
  isDisabled?: boolean,
  isHovered?: boolean,
  isFocused?: boolean,
  isPressed?: boolean,
  isReadOnly?: boolean,
  isInvalid?: boolean,
}

export type StyleOverwrite<TState, TStyle> =
  TStyle | ((prev: TStyle, state: TState) => TStyle)

export type StyleResolverFunction<TState, TStyle> = (
  props: TState,
  overwrite?: StyleOverwrite<TState, TStyle>,
) => TStyle

export const createStyleResolver = <TState, TStyle>(
  resolve: (props: TState) => TStyle
): StyleResolverFunction<TState, TStyle> => {
  return (props, overwrite) => {
    const base = resolve(props)

    if (overwrite === undefined) {
      return base
    }

    if (typeof overwrite === 'function') {
      return (overwrite as (prev: TStyle, state: TState) => TStyle)(base, props)
    }

    return [base, overwrite] as TStyle
  }
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
      return (overwrite as (prev: TValue, state: TState) => TValue)(base, props)
    }

    return overwrite
  }
}
