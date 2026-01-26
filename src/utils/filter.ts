import type {
  TextFilterValue,
  NumberFilterValue,
  DateFilterValue,
  DatetimeFilterValue,
  BooleanFilterValue,
  TagsFilterValue,
  TagsSingleFilterValue,
  GenericFilterValue
} from '../components/layout/table/TableFilter'
import { TableFilterOperator } from '../components/layout/table/TableFilter'



/**
 * Filters a text value based on the provided filter value.
 */
export function filterText(value: unknown, filterValue: TextFilterValue): boolean {
  const parameter = filterValue.parameter
  const operator = filterValue.operator
  const isCaseSensitive = filterValue.parameter.isCaseSensitive ?? false

  if (operator === 'textNotWhitespace') {
    return value?.toString().trim().length > 0
  }

  const searchText = isCaseSensitive ? parameter.searchText ?? '' : (parameter.searchText ?? '').toLowerCase()
  const cellText = isCaseSensitive ? value?.toString() ?? '' : value?.toString().toLowerCase() ?? ''

  switch (operator) {
  case 'textEquals':
    return cellText === searchText
  case 'textNotEquals':
    return cellText !== searchText
  case 'textContains':
    return cellText.includes(searchText)
  case 'textNotContains':
    return !cellText.includes(searchText)
  case 'textStartsWith':
    return cellText.startsWith(searchText)
  case 'textEndsWith':
    return cellText.endsWith(searchText)
  case 'undefined':
    return value === undefined || value === null
  case 'notUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}

/**
 * Filters a number value based on the provided filter value.
 */
export function filterNumber(value: unknown, filterValue: NumberFilterValue): boolean {
  const parameter = filterValue.parameter
  const operator = filterValue.operator

  if (typeof value !== 'number') {
    if (operator === 'undefined') {
      return value === undefined || value === null
    }
    if (operator === 'notUndefined') {
      return value !== undefined && value !== null
    }
    return false
  }

  switch (operator) {
  case 'numberEquals':
    return value === parameter.compareValue
  case 'numberNotEquals':
    return value !== parameter.compareValue
  case 'numberGreaterThan':
    return value > (parameter.compareValue ?? 0)
  case 'numberGreaterThanOrEqual':
    return value >= (parameter.compareValue ?? 0)
  case 'numberLessThan':
    return value < (parameter.compareValue ?? 0)
  case 'numberLessThanOrEqual':
    return value <= (parameter.compareValue ?? 0)
  case 'numberBetween':
    return value >= (parameter.min ?? -Infinity) && value <= (parameter.max ?? Infinity)
  case 'numberNotBetween':
    return value < (parameter.min ?? -Infinity) || value > (parameter.max ?? Infinity)
  case 'undefined':
    return value === undefined || value === null
  case 'notUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}

/**
 * Parses a date value from various formats.
 */
function parseDate(dateValue: Date | string | number | undefined | null): Date | null {
  if (!dateValue) return null
  if (dateValue instanceof Date) return dateValue
  if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    const parsed = new Date(dateValue)
    return isNaN(parsed.getTime()) ? null : parsed
  }
  return null
}

/**
 * Normalizes a date to date-only (removes time component).
 */
function normalizeToDateOnly(date: Date): Date {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

/**
 * Filters a date value based on the provided filter value.
 * Only compares dates, ignoring time components.
 */
export function filterDate(value: unknown, filterValue: DateFilterValue): boolean {
  const parameter = filterValue.parameter
  const operator = filterValue.operator

  const date = parseDate(value as Date | string | number | undefined | null)
  if (!date && !TableFilterOperator.generic.some(o => o === operator)) return false

  const normalizedDate = date ? normalizeToDateOnly(date) : null

  switch (operator) {
  case 'dateEquals': {
    const filterDate = parseDate(parameter.compareDate)
    if (!filterDate || !normalizedDate) return false
    return normalizedDate.getTime() === normalizeToDateOnly(filterDate).getTime()
  }
  case 'dateNotEquals': {
    const filterDate = parseDate(parameter.compareDate)
    if (!filterDate || !normalizedDate) return false
    return normalizedDate.getTime() !== normalizeToDateOnly(filterDate).getTime()
  }
  case 'dateGreaterThan': {
    const filterDate = parseDate(parameter.compareDate)
    if (!filterDate || !normalizedDate) return false
    return normalizedDate > normalizeToDateOnly(filterDate)
  }
  case 'dateGreaterThanOrEqual': {
    const filterDate = parseDate(parameter.compareDate)
    if (!filterDate || !normalizedDate) return false
    return normalizedDate >= normalizeToDateOnly(filterDate)
  }
  case 'dateLessThan': {
    const filterDate = parseDate(parameter.compareDate)
    if (!filterDate || !normalizedDate) return false
    return normalizedDate < normalizeToDateOnly(filterDate)
  }
  case 'dateLessThanOrEqual': {
    const filterDate = parseDate(parameter.compareDate)
    if (!filterDate || !normalizedDate) return false
    return normalizedDate <= normalizeToDateOnly(filterDate)
  }
  case 'dateBetween': {
    const minDate = parseDate(parameter.min)
    const maxDate = parseDate(parameter.max)
    if (!minDate || !maxDate || !normalizedDate) return false
    return normalizedDate >= normalizeToDateOnly(minDate) && normalizedDate <= normalizeToDateOnly(maxDate)
  }
  case 'dateNotBetween': {
    const minDate = parseDate(parameter.min)
    const maxDate = parseDate(parameter.max)
    if (!minDate || !maxDate || !normalizedDate) return false
    return normalizedDate < normalizeToDateOnly(minDate) || normalizedDate > normalizeToDateOnly(maxDate)
  }
  case 'undefined':
    return value === undefined || value === null
  case 'notUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}

/**
 * Normalizes a dateTime by removing seconds and milliseconds.
 */
function normalizeDatetime(dateTime: Date): Date {
  const normalized = new Date(dateTime)
  normalized.setSeconds(0, 0)
  return normalized
}

/**
 * Filters a dateTime value based on the provided filter value.
 */
export function filterDatetime(value: unknown, filterValue: DatetimeFilterValue): boolean {
  const parameter = filterValue.parameter
  const operator = filterValue.operator

  const dateTime = parseDate(value as Date | string | number | undefined | null)
  if (!dateTime && !TableFilterOperator.generic.some(o => o === operator)) return false

  const normalizedDatetime = dateTime ? normalizeDatetime(dateTime) : null

  switch (operator) {
  case 'dateTimeEquals': {
    const filterDatetime = parseDate(parameter.compareDatetime)
    if (!filterDatetime || !normalizedDatetime) return false
    return normalizedDatetime.getTime() === normalizeDatetime(filterDatetime).getTime()
  }
  case 'dateTimeNotEquals': {
    const filterDatetime = parseDate(parameter.compareDatetime)
    if (!filterDatetime || !normalizedDatetime) return false
    return normalizedDatetime.getTime() !== normalizeDatetime(filterDatetime).getTime()
  }
  case 'dateTimeGreaterThan': {
    const filterDatetime = parseDate(parameter.compareDatetime)
    if (!filterDatetime || !normalizedDatetime) return false
    return normalizedDatetime > normalizeDatetime(filterDatetime)
  }
  case 'dateTimeGreaterThanOrEqual': {
    const filterDatetime = parseDate(parameter.compareDatetime)
    if (!filterDatetime || !normalizedDatetime) return false
    return normalizedDatetime >= normalizeDatetime(filterDatetime)
  }
  case 'dateTimeLessThan': {
    const filterDatetime = parseDate(parameter.compareDatetime)
    if (!filterDatetime || !normalizedDatetime) return false
    return normalizedDatetime < normalizeDatetime(filterDatetime)
  }
  case 'dateTimeLessThanOrEqual': {
    const filterDatetime = parseDate(parameter.compareDatetime)
    if (!filterDatetime || !normalizedDatetime) return false
    return normalizedDatetime <= normalizeDatetime(filterDatetime)
  }
  case 'dateTimeBetween': {
    const minDatetime = parseDate(parameter.min)
    const maxDatetime = parseDate(parameter.max)
    if (!minDatetime || !maxDatetime || !normalizedDatetime) return false
    return normalizedDatetime >= normalizeDatetime(minDatetime) && normalizedDatetime <= normalizeDatetime(maxDatetime)
  }
  case 'dateTimeNotBetween': {
    const minDatetime = parseDate(parameter.min)
    const maxDatetime = parseDate(parameter.max)
    if (!minDatetime || !maxDatetime || !normalizedDatetime) return false
    return normalizedDatetime < normalizeDatetime(minDatetime) || normalizedDatetime > normalizeDatetime(maxDatetime)
  }
  case 'undefined':
    return value === undefined || value === null
  case 'notUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}

/**
 * Filters a boolean value based on the provided filter value.
 */
export function filterBoolean(value: unknown, filterValue: BooleanFilterValue): boolean {
  const operator = filterValue.operator

  switch (operator) {
  case 'booleanIsTrue':
    return value === true
  case 'booleanIsFalse':
    return value === false
  case 'undefined':
    return value === undefined || value === null
  case 'notUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}

/**
 * Filters a tags array value based on the provided filter value.
 */
export function filterTags(value: unknown, filterValue: TagsFilterValue): boolean {
  const parameter = filterValue.parameter
  const operator = filterValue.operator

  switch (operator) {
  case 'tagsEquals': {
    if (!Array.isArray(value) || !Array.isArray(parameter.searchTags)) return false
    if (value.length !== parameter.searchTags.length) return false
    const valueSet = new Set(value)
    const searchTagsSet = new Set(parameter.searchTags)
    if (valueSet.size !== searchTagsSet.size) return false
    return Array.from(valueSet).every(tag => searchTagsSet.has(tag))
  }
  case 'tagsNotEquals': {
    if (!Array.isArray(value) || !Array.isArray(parameter.searchTags)) return true
    if (value.length !== parameter.searchTags.length) return true
    const valueSet = new Set(value)
    const searchTagsSet = new Set(parameter.searchTags)
    if (valueSet.size !== searchTagsSet.size) return true
    return !Array.from(valueSet).every(tag => searchTagsSet.has(tag))
  }
  case 'tagsContains': {
    if (!Array.isArray(value) || !Array.isArray(parameter.searchTags)) return false
    return parameter.searchTags.every(tag => value.includes(tag))
  }
  case 'tagsNotContains': {
    if (!Array.isArray(value) || !Array.isArray(parameter.searchTags)) return true
    return !parameter.searchTags.every(tag => value.includes(tag))
  }
  case 'undefined':
    return value === undefined || value === null
  case 'notUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}

/**
 * Filters a single tag value based on the provided filter value.
 */
export function filterTagsSingle(value: unknown, filterValue: TagsSingleFilterValue): boolean {
  const parameter = filterValue.parameter
  const operator = filterValue.operator

  switch (operator) {
  case 'tagsSingleEquals':
    return value === parameter.searchTag
  case 'tagsSingleNotEquals':
    return value !== parameter.searchTag
  case 'tagsSingleContains':
    return parameter.searchTagsContains?.includes(value) ?? false
  case 'tagsSingleNotContains':
    return !(parameter.searchTagsContains?.includes(value) ?? false)
  case 'undefined':
    return value === undefined || value === null
  case 'notUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}

/**
 * Filters a generic value based on the provided filter value.
 */
export function filterGeneric(value: unknown, filterValue: GenericFilterValue): boolean {
  const operator = filterValue.operator

  switch (operator) {
  case 'undefined':
    return value === undefined || value === null
  case 'notUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}
