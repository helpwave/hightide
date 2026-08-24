import type { EnumUtilsType } from '@helpwave/hightide-utils/utils'

const useSelectFirstHighlightBehaviorValues = ['first', 'last'] as const
export type UseSelectFirstHighlightBehavior = (typeof useSelectFirstHighlightBehaviorValues)[number]
const allowedUseSelectFirstHighlightBehaviorValues: ReadonlySet<string> = new Set(
  useSelectFirstHighlightBehaviorValues
)
function isUseSelectFirstHighlightBehaviorValue(value: unknown): value is UseSelectFirstHighlightBehavior {
  if (typeof value !== 'string') {
    return false
  }
  return allowedUseSelectFirstHighlightBehaviorValues.has(value)
}
export const UseSelectFirstHighlightBehaviorUtils: EnumUtilsType<UseSelectFirstHighlightBehavior> = {
  values: useSelectFirstHighlightBehaviorValues,
  set: allowedUseSelectFirstHighlightBehaviorValues,
  isValue: isUseSelectFirstHighlightBehaviorValue,
}
