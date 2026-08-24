import type { EnumUtilsType } from '@helpwave/hightide-utils/utils'

const useMultiSelectFirstHighlightBehaviorValues = ['first', 'last'] as const
export type UseMultiSelectFirstHighlightBehavior = (typeof useMultiSelectFirstHighlightBehaviorValues)[number]
const allowedUseMultiSelectFirstHighlightBehaviorValues: ReadonlySet<string> = new Set(
  useMultiSelectFirstHighlightBehaviorValues
)
function isUseMultiSelectFirstHighlightBehaviorValue(value: unknown): value is UseMultiSelectFirstHighlightBehavior {
  if (typeof value !== 'string') {
    return false
  }
  return allowedUseMultiSelectFirstHighlightBehaviorValues.has(value)
}
export const UseMultiSelectFirstHighlightBehaviorUtils: EnumUtilsType<UseMultiSelectFirstHighlightBehavior> = {
  values: useMultiSelectFirstHighlightBehaviorValues,
  set: allowedUseMultiSelectFirstHighlightBehaviorValues,
  isValue: isUseMultiSelectFirstHighlightBehaviorValue,
}
