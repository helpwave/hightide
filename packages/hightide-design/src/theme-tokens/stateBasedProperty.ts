export type StateBasedPropertyOverride<S extends string, P> = {
  condition?: ReadonlySet<S>,
  negativeCondition?: ReadonlySet<S>,
  value: Partial<P>,
}

export type StateBasedProperty<S extends string, P> = {
  base: P,
  overrides?: ReadonlyArray<StateBasedPropertyOverride<S, P>>,
}

export const matchesStateConditions = <S extends string>(
  active: ReadonlySet<S>,
  condition?: ReadonlySet<S>
): boolean => {
  if (condition === undefined || condition.size === 0) {
    return true
  }

  for (const state of condition) {
    if (!active.has(state)) {
      return false
    }
  }

  return true
}

export const matchesNegativeStateConditions = <S extends string>(
  active: ReadonlySet<S>,
  negativeCondition?: ReadonlySet<S>
): boolean => {
  if (negativeCondition === undefined || negativeCondition.size === 0) {
    return true
  }

  for (const state of negativeCondition) {
    if (active.has(state)) {
      return false
    }
  }

  return true
}

export const resolveStateBasedProperty = <S extends string, P extends object>(
  property: StateBasedProperty<S, P>,
  activeStates: ReadonlySet<S>
): P => {
  let result: P = { ...property.base }

  for (const override of property.overrides ?? []) {
    if (
      matchesStateConditions(activeStates, override.condition)
      && matchesNegativeStateConditions(activeStates, override.negativeCondition)
    ) {
      result = { ...result, ...override.value }
    }
  }

  return result
}
