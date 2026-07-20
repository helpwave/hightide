export type InteractionState = {
  isDisabled?: boolean,
  isHovered?: boolean,
  isFocused?: boolean,
  isPressed?: boolean,
  isReadOnly?: boolean,
  isInvalid?: boolean,
}

export type ResolverFunction<TState, TStyle> = (props: TState) => TStyle
