export type StateBasedTokenPropertyOverride<S extends string, V> = {
  condition?: ReadonlySet<S>,
  negativeCondition?: ReadonlySet<S>,
  value: V,
}

export type StateBasedTokenProperty<S extends string, V> = {
  base: V,
  overrides?: ReadonlyArray<StateBasedTokenPropertyOverride<S, V>>,
}
