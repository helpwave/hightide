import { useCallback } from 'react'
import { DateUtils } from '@/src/utils/date'
import { useLocale } from '@/src/global-contexts/LocaleContext'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { type FilterOperator } from './FilterOperator'
import type { DataType } from './data-types'

export type FilterParameter = {
  stringValue?: string,
  numberValue?: number,
  numberMin?: number,
  numberMax?: number,
  booleanValue?: boolean,
  dateValue?: Date,
  dateMin?: Date,
  dateMax?: Date,
  uuidValue?: unknown,
  uuidValues?: unknown[],
}

const allowedOperatorsByDataType: Record<DataType, FilterOperator[]> = {
  text: ['equals', 'notEquals', 'contains', 'notContains', 'startsWith', 'endsWith', 'isUndefined', 'isNotUndefined'],
  number: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'notBetween', 'isUndefined', 'isNotUndefined'],
  date: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'notBetween', 'isUndefined', 'isNotUndefined'],
  dateTime: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'notBetween', 'isUndefined', 'isNotUndefined'],
  boolean: ['isTrue', 'isFalse', 'isUndefined', 'isNotUndefined'],
  multiTags: ['equals', 'notEquals', 'contains', 'notContains', 'isUndefined', 'isNotUndefined'],
  singleTag: ['equals', 'notEquals', 'contains', 'notContains', 'isUndefined', 'isNotUndefined'],
  unknownType: ['isUndefined', 'isNotUndefined'],
}

export type FilterValue = {
  dataType: DataType,
  operator: FilterOperator,
  parameter: FilterParameter,
}

const OPERATORS_WITHOUT_PARAMETERS: FilterOperator[] = [
  'isUndefined',
  'isNotUndefined',
  'isTrue',
  'isFalse',
]

function isParameterValidForOperator(
  dataType: DataType,
  operator: FilterOperator,
  parameter: FilterParameter
): boolean {
  if (OPERATORS_WITHOUT_PARAMETERS.includes(operator)) {
    return true
  }

  switch (dataType) {
  case 'text': {
    return typeof parameter.stringValue === 'string'
  }
  case 'number': {
    if (operator === 'between' || operator === 'notBetween') {
      const min = parameter.numberMin
      const max = parameter.numberMax
      return (
        typeof min === 'number' &&
        !Number.isNaN(min) &&
        typeof max === 'number' &&
        !Number.isNaN(max) &&
        min <= max
      )
    }
    const v = parameter.numberValue
    return typeof v === 'number' && !Number.isNaN(v)
  }
  case 'date':
  case 'dateTime': {
    if (operator === 'between' || operator === 'notBetween') {
      const minDate = DateUtils.tryParseDate(parameter.dateMin)
      const maxDate = DateUtils.tryParseDate(parameter.dateMax)
      if (!minDate || !maxDate) return false
      const minNorm = dataType === 'date'
        ? DateUtils.toOnlyDate(minDate).getTime()
        : DateUtils.toDateTimeOnly(minDate).getTime()
      const maxNorm = dataType === 'date'
        ? DateUtils.toOnlyDate(maxDate).getTime()
        : DateUtils.toDateTimeOnly(maxDate).getTime()
      return minNorm <= maxNorm
    }
    return DateUtils.tryParseDate(parameter.dateValue) != null
  }
  case 'boolean':
    return true
  case 'multiTags': {
    return Array.isArray(parameter.uuidValues)
  }
  case 'singleTag': {
    if (operator === 'contains' || operator === 'notContains') {
      return Array.isArray(parameter.uuidValues)
    }
    if(operator === 'equals' || operator === 'notEquals') {
      return typeof parameter.uuidValue === 'string'
    }
    return true
  }
  case 'unknownType':
    return true
  default:
    return false
  }
}

function isFilterValueValid(value: FilterValue): boolean {
  const allowed = allowedOperatorsByDataType[value.dataType]
  if (!allowed?.includes(value.operator)) {
    return false
  }
  return isParameterValidForOperator(value.dataType, value.operator, value.parameter)
}

export const FilterValueUtils = {
  allowedOperatorsByDataType,
  isValid: isFilterValueValid,
}

/**
 * Filters a text value based on the provided filter value.
 */
function filterText(value: unknown, operator: FilterOperator, parameter: FilterParameter): boolean {
  const searchText = parameter.stringValue ?? ''
  const cellText = value?.toString() ?? ''

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
    return value === parameter.numberValue
  case 'notEquals':
    return value !== parameter.numberValue
  case 'greaterThan':
    return value > (parameter.numberValue ?? 0)
  case 'greaterThanOrEqual':
    return value >= (parameter.numberValue ?? 0)
  case 'lessThan':
    return value < (parameter.numberValue ?? 0)
  case 'lessThanOrEqual':
    return value <= (parameter.numberValue ?? 0)
  case 'between':
    return value >= (parameter.numberMin ?? -Infinity) && value <= (parameter.numberMax ?? Infinity)
  case 'notBetween':
    return value < (parameter.numberMin ?? -Infinity) || value > (parameter.numberMax ?? Infinity)
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
    const filterDate = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDate) return false
    return normalizedDate.getTime() === DateUtils.toOnlyDate(filterDate).getTime()
  }
  case 'notEquals': {
    const filterDate = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDate) return false
    return normalizedDate.getTime() !== DateUtils.toOnlyDate(filterDate).getTime()
  }
  case 'greaterThan': {
    const filterDate = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDate) return false
    return normalizedDate > DateUtils.toOnlyDate(filterDate)
  }
  case 'greaterThanOrEqual': {
    const filterDate = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDate) return false
    return normalizedDate >= DateUtils.toOnlyDate(filterDate)
  }
  case 'lessThan': {
    const filterDate = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDate) return false
    return normalizedDate < DateUtils.toOnlyDate(filterDate)
  }
  case 'lessThanOrEqual': {
    const filterDate = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDate) return false
    return normalizedDate <= DateUtils.toOnlyDate(filterDate)
  }
  case 'between': {
    const minDate = DateUtils.tryParseDate(parameter.dateMin)
    const maxDate = DateUtils.tryParseDate(parameter.dateMax)
    if (!minDate || !maxDate) return false
    return normalizedDate >= DateUtils.toOnlyDate(minDate) && normalizedDate <= DateUtils.toOnlyDate(maxDate)
  }
  case 'notBetween': {
    const minDate = DateUtils.tryParseDate(parameter.dateMin)
    const maxDate = DateUtils.tryParseDate(parameter.dateMax)
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
    const filterDatetime = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDatetime) return false
    return normalizedDatetime.getTime() === DateUtils.toDateTimeOnly(filterDatetime).getTime()
  }
  case 'notEquals': {
    const filterDatetime = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDatetime) return false
    return normalizedDatetime.getTime() !== DateUtils.toDateTimeOnly(filterDatetime).getTime()
  }
  case 'greaterThan': {
    const filterDatetime = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDatetime) return false
    return normalizedDatetime > DateUtils.toDateTimeOnly(filterDatetime)
  }
  case 'greaterThanOrEqual': {
    const filterDatetime = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDatetime) return false
    return normalizedDatetime >= DateUtils.toDateTimeOnly(filterDatetime)
  }
  case 'lessThan': {
    const filterDatetime = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDatetime) return false
    return normalizedDatetime < DateUtils.toDateTimeOnly(filterDatetime)
  }
  case 'lessThanOrEqual': {
    const filterDatetime = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDatetime) return false
    return normalizedDatetime <= DateUtils.toDateTimeOnly(filterDatetime)
  }
  case 'between': {
    const minDatetime = DateUtils.tryParseDate(parameter.dateMin)
    const maxDatetime = DateUtils.tryParseDate(parameter.dateMax)
    if (!minDatetime || !maxDatetime) return false
    return normalizedDatetime >= DateUtils.toDateTimeOnly(minDatetime) && normalizedDatetime <= DateUtils.toDateTimeOnly(maxDatetime)
  }
  case 'notBetween': {
    const minDatetime = DateUtils.tryParseDate(parameter.dateMin)
    const maxDatetime = DateUtils.tryParseDate(parameter.dateMax)
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
    if (!Array.isArray(value) || !Array.isArray(parameter.uuidValues)) return false
    if (value.length !== parameter.uuidValues.length) return false
    const valueSet = new Set(value)
    const searchTagsSet = new Set(parameter.uuidValues)
    if (valueSet.size !== searchTagsSet.size) return false
    return Array.from(valueSet).every(tag => searchTagsSet.has(tag))
  }
  case 'notEquals': {
    if (!Array.isArray(value) || !Array.isArray(parameter.uuidValues)) return true
    if (value.length !== parameter.uuidValues.length) return true
    const valueSet = new Set(value)
    const searchTagsSet = new Set(parameter.uuidValues)
    if (valueSet.size !== searchTagsSet.size) return true
    return !Array.from(valueSet).every(tag => searchTagsSet.has(tag))
  }
  case 'contains': {
    if (!Array.isArray(value) || !Array.isArray(parameter.uuidValues)) return false
    return parameter.uuidValues.every(tag => value.includes(tag))
  }
  case 'notContains': {
    if (!Array.isArray(value) || !Array.isArray(parameter.uuidValues)) return true
    return !parameter.uuidValues.every(tag => value.includes(tag))
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
    return value === parameter.uuidValue
  case 'notEquals':
    return value !== parameter.uuidValue
  case 'contains':
    return parameter.uuidValues?.includes(value) ?? false
  case 'notContains':
    return !(parameter.uuidValues?.includes(value) ?? false)
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