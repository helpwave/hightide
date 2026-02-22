import { useCallback } from 'react'
import { DateUtils } from '@/src/utils/date'
import { useLocale } from '@/src/global-contexts/LocaleContext'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { type FilterOperator } from './FilterOperator'
import type { DataType } from './data-types'

export type FilterParameter = {
  searchText?: string,
  isCaseSensitive?: boolean,
  compareValue?: number,
  minNumber?: number,
  maxNumber?: number,
  compareDate?: Date,
  minDate?: Date,
  maxDate?: Date,
  multiOptionSearch?: unknown[],
  singleOptionSearch?: unknown,
}

export type FilterValue = {
  dataType: DataType,
  operator: FilterOperator,
  parameter: FilterParameter,
}

/**
 * Filters a text value based on the provided filter value.
 */
function filterText(value: unknown, operator: FilterOperator, parameter: FilterParameter): boolean {
  const isCaseSensitive = parameter.isCaseSensitive ?? false

  const searchText = isCaseSensitive ? parameter.searchText ?? '' : (parameter.searchText ?? '').toLowerCase()
  const cellText = isCaseSensitive ? value?.toString() ?? '' : value?.toString().toLowerCase() ?? ''

  switch (operator) {
  case 'equals':
    return cellText === searchText
  case 'notEquals':
    return cellText !== searchText
  case 'contains':
    return cellText.includes(searchText)
  case 'notContains':
    return !cellText.includes(searchText)
  case 'startsWith':
    return cellText.startsWith(searchText)
  case 'endsWith':
    return cellText.endsWith(searchText)
  case 'isUndefined':
    return value === undefined || value === null
  case 'isNotUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}

/**
   * Filters a number value based on the provided filter value.
   */
function filterNumber(value: unknown, operator: FilterOperator, parameter: FilterParameter): boolean {
  if (typeof value !== 'number') {
    if (operator === 'isUndefined') {
      return value === undefined || value === null
    }
    if (operator === 'isNotUndefined') {
      return value !== undefined && value !== null
    }
    return false
  }

  switch (operator) {
  case 'equals':
    return value === parameter.compareValue
  case 'notEquals':
    return value !== parameter.compareValue
  case 'greaterThan':
    return value > (parameter.compareValue ?? 0)
  case 'greaterThanOrEqual':
    return value >= (parameter.compareValue ?? 0)
  case 'lessThan':
    return value < (parameter.compareValue ?? 0)
  case 'lessThanOrEqual':
    return value <= (parameter.compareValue ?? 0)
  case 'between':
    return value >= (parameter.minNumber ?? -Infinity) && value <= (parameter.maxNumber ?? Infinity)
  case 'notBetween':
    return value < (parameter.minNumber ?? -Infinity) || value > (parameter.maxNumber ?? Infinity)
  case 'isUndefined':
    return value === undefined || value === null
  case 'isNotUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}

/**
   * Filters a date value based on the provided filter value.
   * Only compares dates, ignoring time components.
   */
function filterDate(value: unknown, operator: FilterOperator, parameter: FilterParameter): boolean {
  const date = DateUtils.tryParseDate(value as Date | string | number | undefined | null)
  if (!date) {
    if (operator === 'isUndefined') {
      return value === undefined || value === null
    }
    if (operator === 'isNotUndefined') {
      return value !== undefined && value !== null
    }
    return false
  }

  const normalizedDate = DateUtils.toOnlyDate(date)

  switch (operator) {
  case 'equals': {
    const filterDate = DateUtils.tryParseDate(parameter.compareDate)
    if (!filterDate) return false
    return normalizedDate.getTime() === DateUtils.toOnlyDate(filterDate).getTime()
  }
  case 'notEquals': {
    const filterDate = DateUtils.tryParseDate(parameter.compareDate)
    if (!filterDate) return false
    return normalizedDate.getTime() !== DateUtils.toOnlyDate(filterDate).getTime()
  }
  case 'greaterThan': {
    const filterDate = DateUtils.tryParseDate(parameter.compareDate)
    if (!filterDate) return false
    return normalizedDate > DateUtils.toOnlyDate(filterDate)
  }
  case 'greaterThanOrEqual': {
    const filterDate = DateUtils.tryParseDate(parameter.compareDate)
    if (!filterDate) return false
    return normalizedDate >= DateUtils.toOnlyDate(filterDate)
  }
  case 'lessThan': {
    const filterDate = DateUtils.tryParseDate(parameter.compareDate)
    if (!filterDate) return false
    return normalizedDate < DateUtils.toOnlyDate(filterDate)
  }
  case 'lessThanOrEqual': {
    const filterDate = DateUtils.tryParseDate(parameter.compareDate)
    if (!filterDate) return false
    return normalizedDate <= DateUtils.toOnlyDate(filterDate)
  }
  case 'between': {
    const minDate = DateUtils.tryParseDate(parameter.minDate)
    const maxDate = DateUtils.tryParseDate(parameter.maxDate)
    if (!minDate || !maxDate) return false
    return normalizedDate >= DateUtils.toOnlyDate(minDate) && normalizedDate <= DateUtils.toOnlyDate(maxDate)
  }
  case 'notBetween': {
    const minDate = DateUtils.tryParseDate(parameter.minDate)
    const maxDate = DateUtils.tryParseDate(parameter.maxDate)
    if (!minDate || !maxDate) return false
    return normalizedDate < DateUtils.toOnlyDate(minDate) || normalizedDate > DateUtils.toOnlyDate(maxDate)
  }
  default:
    return false
  }
}

/**
   * Filters a dateTime value based on the provided filter value.
   */
function filterDateTime(value: unknown, operator: FilterOperator, parameter: FilterParameter): boolean {
  const dateTime = DateUtils.tryParseDate(value as Date | string | number | undefined | null)
  if (!dateTime) {
    if (operator === 'isUndefined') {
      return value === undefined || value === null
    }
    if (operator === 'isNotUndefined') {
      return value !== undefined && value !== null
    }
    return false
  }

  const normalizedDatetime = DateUtils.toDateTimeOnly(dateTime)

  switch (operator) {
  case 'equals': {
    const filterDatetime = DateUtils.tryParseDate(parameter.compareDate)
    if (!filterDatetime) return false
    return normalizedDatetime.getTime() === DateUtils.toDateTimeOnly(filterDatetime).getTime()
  }
  case 'notEquals': {
    const filterDatetime = DateUtils.tryParseDate(parameter.compareDate)
    if (!filterDatetime) return false
    return normalizedDatetime.getTime() !== DateUtils.toDateTimeOnly(filterDatetime).getTime()
  }
  case 'greaterThan': {
    const filterDatetime = DateUtils.tryParseDate(parameter.compareDate)
    if (!filterDatetime) return false
    return normalizedDatetime > DateUtils.toDateTimeOnly(filterDatetime)
  }
  case 'greaterThanOrEqual': {
    const filterDatetime = DateUtils.tryParseDate(parameter.compareDate)
    if (!filterDatetime) return false
    return normalizedDatetime >= DateUtils.toDateTimeOnly(filterDatetime)
  }
  case 'lessThan': {
    const filterDatetime = DateUtils.tryParseDate(parameter.compareDate)
    if (!filterDatetime) return false
    return normalizedDatetime < DateUtils.toDateTimeOnly(filterDatetime)
  }
  case 'lessThanOrEqual': {
    const filterDatetime = DateUtils.tryParseDate(parameter.compareDate)
    if (!filterDatetime) return false
    return normalizedDatetime <= DateUtils.toDateTimeOnly(filterDatetime)
  }
  case 'between': {
    const minDatetime = DateUtils.tryParseDate(parameter.minDate)
    const maxDatetime = DateUtils.tryParseDate(parameter.maxDate)
    if (!minDatetime || !maxDatetime) return false
    return normalizedDatetime >= DateUtils.toDateTimeOnly(minDatetime) && normalizedDatetime <= DateUtils.toDateTimeOnly(maxDatetime)
  }
  case 'notBetween': {
    const minDatetime = DateUtils.tryParseDate(parameter.minDate)
    const maxDatetime = DateUtils.tryParseDate(parameter.maxDate)
    if (!minDatetime || !maxDatetime) return false
    return normalizedDatetime < DateUtils.toDateTimeOnly(minDatetime) || normalizedDatetime > DateUtils.toDateTimeOnly(maxDatetime)
  }
  default:
    return false
  }
}

/**
   * Filters a boolean value based on the provided filter value.
   */
function filterBoolean(value: unknown, operator: FilterOperator): boolean {
  switch (operator) {
  case 'isTrue':
    return value === true
  case 'isFalse':
    return value === false
  case 'isUndefined':
    return value === undefined || value === null
  case 'isNotUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}

/**
   * Filters a tags array value based on the provided filter value.
   */
function filterMultiTags(value: unknown, operator: FilterOperator, parameter: FilterParameter): boolean {
  switch (operator) {
  case 'equals': {
    if (!Array.isArray(value) || !Array.isArray(parameter.multiOptionSearch)) return false
    if (value.length !== parameter.multiOptionSearch.length) return false
    const valueSet = new Set(value)
    const searchTagsSet = new Set(parameter.multiOptionSearch)
    if (valueSet.size !== searchTagsSet.size) return false
    return Array.from(valueSet).every(tag => searchTagsSet.has(tag))
  }
  case 'notEquals': {
    if (!Array.isArray(value) || !Array.isArray(parameter.multiOptionSearch)) return true
    if (value.length !== parameter.multiOptionSearch.length) return true
    const valueSet = new Set(value)
    const searchTagsSet = new Set(parameter.multiOptionSearch)
    if (valueSet.size !== searchTagsSet.size) return true
    return !Array.from(valueSet).every(tag => searchTagsSet.has(tag))
  }
  case 'contains': {
    if (!Array.isArray(value) || !Array.isArray(parameter.multiOptionSearch)) return false
    return parameter.multiOptionSearch.every(tag => value.includes(tag))
  }
  case 'notContains': {
    if (!Array.isArray(value) || !Array.isArray(parameter.multiOptionSearch)) return true
    return !parameter.multiOptionSearch.every(tag => value.includes(tag))
  }
  case 'isUndefined':
    return value === undefined || value === null
  case 'isNotUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}

/**
   * Filters a single tag value based on the provided filter value.
   */
function filterSingleTag(value: unknown, operator: FilterOperator, parameter: FilterParameter): boolean {
  switch (operator) {
  case 'equals':
    return value === parameter.singleOptionSearch
  case 'notEquals':
    return value !== parameter.singleOptionSearch
  case 'contains':
    return parameter.multiOptionSearch?.includes(value) ?? false
  case 'notContains':
    return !(parameter.multiOptionSearch?.includes(value) ?? false)
  case 'isUndefined':
    return value === undefined || value === null
  case 'isNotUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}

/**
 * Filters a generic value based on the provided filter value.
 */
function filterUnknownType(value: unknown, operator: FilterOperator): boolean {
  switch (operator) {
  case 'isUndefined':
    return value === undefined || value === null
  case 'isNotUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}

export const FilterFunctions: Record<DataType, (value: unknown, operator: FilterOperator, parameter: FilterParameter) => boolean> = {
  text: filterText,
  number: filterNumber,
  date: filterDate,
  dateTime: filterDateTime,
  boolean: filterBoolean,
  singleTag: filterSingleTag,
  multiTags: filterMultiTags,
  unknownType: filterUnknownType,
}

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
  const { locale } = useLocale()

  return useCallback((value: FilterValue, options?: FilterValueTranslationOptions): string => {
    const p = value.parameter
    const tags = options?.tags
    const dateFormat = value.dataType === 'dateTime' ? 'dateTime' as const : 'date' as const

    switch (value.operator) {
    case 'equals':
      if (value.dataType === 'date' || value.dataType === 'dateTime') {
        return translation('rEquals', { value: formatDateParam(p.compareDate, locale, dateFormat) ?? '-' })
      }
      if (value.dataType === 'singleTag') {
        return translation('rEquals', { value: tagToLabel(tags, p.singleOptionSearch) })
      }
      if (value.dataType === 'multiTags') {
        const valueStr = (p.multiOptionSearch ?? []).map(v => tagToLabel(tags, v)).join(', ')
        return translation('rEquals', { value: valueStr })
      }
      return translation('rEquals', { value: String(p.searchText ?? p.compareValue ?? '') })
    case 'notEquals':
      if (value.dataType === 'date' || value.dataType === 'dateTime') {
        return translation('rNotEquals', { value: formatDateParam(p.compareDate, locale, dateFormat) })
      }
      if (value.dataType === 'singleTag') {
        return translation('rNotEquals', { value: tagToLabel(tags, p.singleOptionSearch) })
      }
      if (value.dataType === 'multiTags') {
        const valueStr = (p.multiOptionSearch ?? []).map(v => tagToLabel(tags, v)).join(', ')
        return translation('rNotEquals', { value: valueStr })
      }
      return translation('rNotEquals', { value: String(p.searchText ?? p.compareValue ?? '') })
    case 'contains':
      if (value.dataType === 'multiTags' || value.dataType === 'singleTag') {
        const valueStr = value.dataType === 'singleTag'
          ? tagToLabel(tags, p.singleOptionSearch)
          : (p.multiOptionSearch ?? []).map(v => tagToLabel(tags, v)).join(', ')
        return translation('rContains', { value: valueStr })
      }
      return translation('rContains', { value: String(p.searchText ?? '') })
    case 'notContains':
      if (value.dataType === 'multiTags' || value.dataType === 'singleTag') {
        const valueStr = value.dataType === 'singleTag'
          ? tagToLabel(tags, p.singleOptionSearch)
          : (p.multiOptionSearch ?? []).map(v => tagToLabel(tags, v)).join(', ')
        return translation('rNotContains', { value: valueStr })
      }
      return translation('rNotContains', { value: `"${String(p.searchText ?? '')}"` })
    case 'startsWith':
      return translation('rStartsWith', { value: `"${String(p.searchText ?? '')}"` })
    case 'endsWith':
      return translation('rEndsWith', { value: `"${String(p.searchText ?? '')}"` })
    case 'greaterThan':
      return translation('rGreaterThan', {
        value: value.dataType === 'date' || value.dataType === 'dateTime'
          ? formatDateParam(p.compareDate, locale, dateFormat) ?? '-'
          : String(p.compareValue ?? '-'),
      })
    case 'greaterThanOrEqual':
      return translation('rGreaterThanOrEqual', {
        value: value.dataType === 'date' || value.dataType === 'dateTime'
          ? formatDateParam(p.compareDate, locale, dateFormat) ?? '-'
          : String(p.compareValue ?? '-'),
      })
    case 'lessThan':
      return translation('rLessThan', {
        value: value.dataType === 'date' || value.dataType === 'dateTime'
          ? formatDateParam(p.compareDate, locale, dateFormat) ?? '-'
          : String(p.compareValue ?? '-'),
      })
    case 'lessThanOrEqual':
      return translation('rLessThanOrEqual', {
        value: value.dataType === 'date' || value.dataType === 'dateTime'
          ? formatDateParam(p.compareDate, locale, dateFormat) ?? '-'
          : String(p.compareValue ?? '-'),
      })
    case 'between':
      if (value.dataType === 'date' || value.dataType === 'dateTime') {
        return translation('rBetween', {
          value1: formatDateParam(p.minDate, locale, dateFormat) ?? '-',
          value2: formatDateParam(p.maxDate, locale, dateFormat) ?? '-',
        })
      }
      return translation('rBetween', {
        value1: String(p.minNumber ?? '-'),
        value2: String(p.maxNumber ?? '-'),
      })
    case 'notBetween':
      if (value.dataType === 'date' || value.dataType === 'dateTime') {
        return translation('rNotBetween', {
          value1: formatDateParam(p.minDate, locale, dateFormat) ?? '-',
          value2: formatDateParam(p.maxDate, locale, dateFormat) ?? '-',
        })
      }
      return translation('rNotBetween', {
        value1: String(p.minNumber ?? '-'),
        value2: String(p.maxNumber ?? '-'),
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