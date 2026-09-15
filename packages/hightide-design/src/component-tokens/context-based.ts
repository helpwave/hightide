import type { ResolverConfig, ResolverState } from '../primitive-tokens/resolver-types'
import { writingConfigDefaults } from '../utils/box-sides'

export type ContextBasedPropertyOverride<
  V,
  S extends ResolverState,
  C extends ResolverConfig
> = {
  condition?: ReadonlySet<S>,
  negativeCondition?: ReadonlySet<S>,
  configCondition?: Partial<C>,
  value: V,
}

export type ContextBasedProperty<
  V,
  S extends ResolverState = ResolverState,
  C extends ResolverConfig = ResolverConfig
> = {
  base?: V,
  overrides?: ReadonlyArray<ContextBasedPropertyOverride<V, S, C>>,
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

    // TODO conider a better solution here
    const actual = config?.[key] ?? writingConfigDefaults[key]

    if (actual !== value) {
      return false
    }
  }

  return true
}
