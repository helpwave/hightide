import { useCallback } from 'react'
import { DateUtils } from '@helpwave/hightide-utils/utils'
import { useLocalization } from '../../../global-contexts/localization/forward-exports'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import type { FilterValue } from './types'

export type FilterValueTranslationOptions = {
  tags?: ReadonlyArray<{ tag: string, label: string }>,
}

function formatDateParam(
  dateParam: Date | string | number | undefined | null,
  locale: string,
  format: 'date' | 'dateTime'
): string {
  const d = DateUtils.tryParseDate(dateParam)
  return d ? DateUtils.formatAbsolute(d, locale, format) : ''
}

function tagToLabel(tags: ReadonlyArray<{ tag: string, label: string }> | undefined, value: unknown): string {
  if (!tags) return String(value ?? '')
  const entry = tags.find(t => t.tag === value || t.tag === String(value))
  return entry?.label ?? String(value ?? '')
}

export function useFilterValueTranslation(): (value: FilterValue, options?: FilterValueTranslationOptions) => string {
  const translation = useHightideTranslation()
  const { locale } = useLocalization()

  return useCallback((value: FilterValue, options?: FilterValueTranslationOptions): string => {
    const p = value.parameter
    const tags = options?.tags
    const dateFormat = value.dataType === 'dateTime' ? 'dateTime' as const : 'date' as const

    switch (value.operator) {
    case 'equals':
      if (value.dataType === 'date' || value.dataType === 'dateTime') {
        return translation('rEquals', { value: formatDateParam(p.dateValue, locale, dateFormat) ?? '-' })
      }
      if (value.dataType === 'singleTag') {
        return translation('rEquals', { value: tagToLabel(tags, p.uuidValue) })
      }
      if (value.dataType === 'multiTags') {
        const valueStr = (p.uuidValues ?? []).map(v => tagToLabel(tags, v)).join(', ')
        return translation('rEquals', { value: valueStr })
      }
      return translation('rEquals', { value: String(p.stringValue ?? p.numberValue ?? '') })
    case 'notEquals':
      if (value.dataType === 'date' || value.dataType === 'dateTime') {
        return translation('rNotEquals', { value: formatDateParam(p.dateValue, locale, dateFormat) })
      }
      if (value.dataType === 'singleTag') {
        return translation('rNotEquals', { value: tagToLabel(tags, p.uuidValue) })
      }
      if (value.dataType === 'multiTags') {
        const valueStr = (p.uuidValues ?? []).map(v => tagToLabel(tags, v)).join(', ')
        return translation('rNotEquals', { value: valueStr })
      }
      return translation('rNotEquals', { value: String(p.stringValue ?? p.numberValue ?? '') })
    case 'contains':
      if (value.dataType === 'multiTags' || value.dataType === 'singleTag') {
        const valueStr = value.dataType === 'singleTag'
          ? tagToLabel(tags, p.uuidValue)
          : (p.uuidValues ?? []).map(v => tagToLabel(tags, v)).join(', ')
        return translation('rContains', { value: valueStr })
      }
      return translation('rContains', { value: String(p.stringValue ?? '') })
    case 'notContains':
      if (value.dataType === 'multiTags' || value.dataType === 'singleTag') {
        const valueStr = value.dataType === 'singleTag'
          ? tagToLabel(tags, p.uuidValue)
          : (p.uuidValues ?? []).map(v => tagToLabel(tags, v)).join(', ')
        return translation('rNotContains', { value: valueStr })
      }
      return translation('rNotContains', { value: `"${String(p.stringValue ?? '')}"` })
    case 'startsWith':
      return translation('rStartsWith', { value: `"${String(p.stringValue ?? '')}"` })
    case 'endsWith':
      return translation('rEndsWith', { value: `"${String(p.stringValue ?? '')}"` })
    case 'greaterThan':
      return translation('rGreaterThan', {
        value: value.dataType === 'date' || value.dataType === 'dateTime'
          ? formatDateParam(p.dateValue, locale, dateFormat) ?? '-'
          : String(p.numberValue ?? '-'),
      })
    case 'greaterThanOrEqual':
      return translation('rGreaterThanOrEqual', {
        value: value.dataType === 'date' || value.dataType === 'dateTime'
          ? formatDateParam(p.dateValue, locale, dateFormat) ?? '-'
          : String(p.numberValue ?? '-'),
      })
    case 'lessThan':
      return translation('rLessThan', {
        value: value.dataType === 'date' || value.dataType === 'dateTime'
          ? formatDateParam(p.dateValue, locale, dateFormat) ?? '-'
          : String(p.numberValue ?? '-'),
      })
    case 'lessThanOrEqual':
      return translation('rLessThanOrEqual', {
        value: value.dataType === 'date' || value.dataType === 'dateTime'
          ? formatDateParam(p.dateValue, locale, dateFormat) ?? '-'
          : String(p.numberValue ?? '-'),
      })
    case 'between':
      if (value.dataType === 'date' || value.dataType === 'dateTime') {
        return translation('rBetween', {
          value1: formatDateParam(p.dateMin, locale, dateFormat) ?? '-',
          value2: formatDateParam(p.dateMax, locale, dateFormat) ?? '-',
        })
      }
      return translation('rBetween', {
        value1: String(p.numberMin ?? '-'),
        value2: String(p.numberMax ?? '-'),
      })
    case 'notBetween':
      if (value.dataType === 'date' || value.dataType === 'dateTime') {
        return translation('rNotBetween', {
          value1: formatDateParam(p.dateMin, locale, dateFormat) ?? '-',
          value2: formatDateParam(p.dateMax, locale, dateFormat) ?? '-',
        })
      }
      return translation('rNotBetween', {
        value1: String(p.numberMin ?? '-'),
        value2: String(p.numberMax ?? '-'),
      })
    case 'isTrue':
      return translation('isTrue')
    case 'isFalse':
      return translation('isFalse')
    case 'isUndefined':
      return translation('isUndefined')
    case 'isNotUndefined':
      return translation('isNotUndefined')
    default:
      return ''
    }
  }, [translation, locale])
}
