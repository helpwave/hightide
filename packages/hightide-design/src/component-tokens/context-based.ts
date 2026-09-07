export type ContextBasedPropertyOverride<
  S extends string,
  C extends Record<string, string>,
  V
> = {
  condition?: ReadonlySet<S>,
  negativeCondition?: ReadonlySet<S>,
  configCondition?: Partial<C>,
  value: V,
}

export type ContextBasedProperty<
  S extends string,
  C extends Record<string, string>,
  V
> = {
  base: V,
  overrides?: ReadonlyArray<ContextBasedPropertyOverride<S, C, V>>,
}

export const matchesConfigCondition = (
  config: Record<string, string> | undefined,
  condition?: Partial<Record<string, string>>
): boolean => {
  if (condition === undefined) {
    return true
  }

  for (const [key, value] of Object.entries(condition)) {
    if (value === undefined) {
      continue
    }

    if (config?.[key] !== value) {
      return false
    }
  }

  return true
}