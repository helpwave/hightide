import type { ResolverConfig, ResolverRuntimeConfig } from '../primitive-tokens/resolver-types'
import { writingConfigDefaults } from '../utils/box-sides'

export type ContextBasedPropertyOverride<
  V,
  C extends ResolverConfig = ResolverConfig
> = {
  condition?: Partial<C>,
  value: V,
}

export type ContextBasedProperty<
  V,
  C extends ResolverConfig = ResolverConfig
> = {
  base?: V,
  overrides?: ReadonlyArray<ContextBasedPropertyOverride<V, C>>,
}

export const matchesCondition = (
  config: ResolverRuntimeConfig | undefined,
  condition?: Partial<Record<string, string | true | false | undefined>>
): boolean => {
  if (condition === undefined) {
    return true
  }

  for (const [key, expected] of Object.entries(condition)) {
    if (expected === undefined) {
      continue
    }

    const actual = config?.[key]

    if (expected === true) {
      if (typeof actual !== 'string') {
        return false
      }
      continue
    }

    if (expected === false) {
      if (actual !== undefined) {
        return false
      }
      continue
    }

    const resolved = actual ?? writingConfigDefaults[key]
    if (resolved !== expected) {
      return false
    }
  }

  return true
}
