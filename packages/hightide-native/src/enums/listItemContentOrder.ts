import type { EnumUtilsType } from '@helpwave/hightide-utils/utils'

const listItemContentOrderValues = ['titleFirst', 'subtitleFirst'] as const
export type ListItemContentOrder = (typeof listItemContentOrderValues)[number]
const allowedListItemContentOrderValues: ReadonlySet<string> = new Set(
  listItemContentOrderValues
)
function isListItemContentOrderValue(value: unknown): value is ListItemContentOrder {
  if (typeof value !== 'string') {
    return false
  }
  return allowedListItemContentOrderValues.has(value)
}
export const ListItemContentOrderUtils: EnumUtilsType<ListItemContentOrder> = {
  values: listItemContentOrderValues,
  set: allowedListItemContentOrderValues,
  isValue: isListItemContentOrderValue,
}
