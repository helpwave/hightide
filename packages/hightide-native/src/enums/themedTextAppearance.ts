import type { EnumUtilsType } from '@helpwave/hightide-utils/utils'

const themedTextAppearanceValues = ['normal', 'description'] as const
export type ThemedTextAppearance = (typeof themedTextAppearanceValues)[number]
const allowedThemedTextAppearanceValues: ReadonlySet<string> = new Set(
  themedTextAppearanceValues
)
function isThemedTextAppearanceValue(value: unknown): value is ThemedTextAppearance {
  if (typeof value !== 'string') {
    return false
  }
  return allowedThemedTextAppearanceValues.has(value)
}
export const ThemedTextAppearanceUtils: EnumUtilsType<ThemedTextAppearance> = {
  values: themedTextAppearanceValues,
  set: allowedThemedTextAppearanceValues,
  isValue: isThemedTextAppearanceValue,
}
