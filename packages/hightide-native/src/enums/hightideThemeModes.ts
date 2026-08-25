import type { EnumUtilsType } from '@helpwave/hightide-utils/utils'

const hightideThemeModesValues = ['dark', 'light'] as const
export type HightideThemeModes = (typeof hightideThemeModesValues)[number]
const allowedHightideThemeModesValues: ReadonlySet<string> = new Set(
  hightideThemeModesValues
)
function isHightideThemeModesValue(value: unknown): value is HightideThemeModes {
  if (typeof value !== 'string') {
    return false
  }
  return allowedHightideThemeModesValues.has(value)
}
export const HightideThemeModesUtils: EnumUtilsType<HightideThemeModes> = {
  values: hightideThemeModesValues,
  set: allowedHightideThemeModesValues,
  isValue: isHightideThemeModesValue,
}
