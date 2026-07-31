export type StateBasedPropertyOverride<S extends string, P> = {
  condition: S[],
  value: Partial<P>,
}

export type StateBasedProperty<S extends string, P> = {
  base: P,
  overrides?: StateBasedPropertyOverride<S, P>[],
}

export const matchesStateConditions = <S extends string>(
  active: ReadonlySet<S>,
  condition: readonly S[]
): boolean => {
  if (condition.length === 0) {
    return true
  }

  return condition.every((state) => active.has(state))
}

export const resolveStateBasedProperty = <S extends string, P extends object>(
  property: StateBasedProperty<S, P>,
  activeStates: ReadonlySet<S>
): P => {
  let result: P = { ...property.base }

  for (const override of property.overrides ?? []) {
    if (matchesStateConditions(activeStates, override.condition)) {
      result = { ...result, ...override.value }
    }
  }

  return result
}
