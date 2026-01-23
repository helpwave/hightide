import type { FilterFn } from '@tanstack/react-table'

export const TableFilterOperator = {
  text: ['textEquals', 'textNotEquals', 'textNotWhitespace', 'textContains', 'textNotContains', 'textStartsWith', 'textEndsWith'],
  number: ['numberEquals', 'numberNotEquals', 'numberGreaterThan', 'numberGreaterThanOrEqual', 'numberLessThan', 'numberLessThanOrEqual', 'numberBetween', 'numberNotBetween'],
  date: ['dateEquals', 'dateNotEquals', 'dateGreaterThan', 'dateGreaterThanOrEqual', 'dateLessThan', 'dateLessThanOrEqual', 'dateBetween', 'dateNotBetween'],
  boolean: ['booleanIsTrue', 'booleanIsFalse'],
  tags: ['tagsEquals', 'tagsNotEquals', 'tagsContains', 'tagsNotContains'],
  generic: ['undefined', 'notUndefined']
} as const

export type TableGenericFilter = (typeof TableFilterOperator.generic)[number]
export type TableTextFilter = (typeof TableFilterOperator.text)[number] | TableGenericFilter
export type TableNumberFilter = (typeof TableFilterOperator.number)[number] | TableGenericFilter
export type TableDateFilter = (typeof TableFilterOperator.date)[number]| TableGenericFilter
export type TableBooleanFilter = (typeof TableFilterOperator.boolean)[number] | TableGenericFilter
export type TableTagsFilter = (typeof TableFilterOperator.tags)[number] | TableGenericFilter


export type TableFilterType = TableTextFilter | TableNumberFilter | TableDateFilter | TableBooleanFilter | TableTagsFilter | TableGenericFilter

export type TableFilterCategory = keyof typeof TableFilterOperator

export function isTableFilterCategory(value: unknown): value is TableFilterCategory {
  return typeof value === 'string' && value in TableFilterOperator
}

export type TextFilterParameter = {
  searchText?: string,
}

export type NumberFilterParameter = {
  compareValue?: number,
  min?: number,
  max?: number,
}

export type DateFilterParameter = {
  compareDate?: Date,
  min?: Date,
  max?: Date,
}

export type BooleanFilterParameter = Record<string, never>

export type TagsFilterParameter = {
  searchTags?: unknown[],
}

export type GenericFilterParameter = Record<string, never>

export type TextFilterValue = {
  operator: TableTextFilter,
  parameter: TextFilterParameter,
}

export type NumberFilterValue = {
  operator: TableNumberFilter,
  parameter: NumberFilterParameter,
}

export type DateFilterValue = {
  operator: TableDateFilter,
  parameter: DateFilterParameter,
}

export type BooleanFilterValue = {
  operator: TableBooleanFilter,
  parameter: BooleanFilterParameter,
}

export type TagsFilterValue = {
  operator: TableTagsFilter,
  parameter: TagsFilterParameter,
}

export type GenericFilterValue = {
  operator: TableGenericFilter,
  parameter: GenericFilterParameter,
}

export type TableFilterValue = TextFilterValue | NumberFilterValue | DateFilterValue | BooleanFilterValue | TagsFilterValue | GenericFilterValue

const textFilter: FilterFn<unknown> = (row, columnId, filterValue: TextFilterValue) => {
  const value = row.getValue<string>(columnId)
  const parameter = filterValue.parameter
  const operator = filterValue.operator

  if (operator === 'textNotWhitespace') {
    return value?.toString().trim().length > 0
  }

  const searchText = (parameter.searchText ?? '').toLowerCase()
  const cellText = value?.toString().toLowerCase() ?? ''

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

const numberFilter: FilterFn<unknown> = (row, columnId, filterValue: NumberFilterValue) => {
  const value = row.getValue<number>(columnId)
  const parameter = filterValue.parameter
  const operator = filterValue.operator

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

const dateFilter: FilterFn<unknown> = (row, columnId, filterValue: DateFilterValue) => {
  const value = row.getValue<Date>(columnId)
  const parameter = filterValue.parameter
  const operator = filterValue.operator

  const parseDate = (dateValue: Date | string | number | undefined | null): Date | null => {
    if (!dateValue) return null
    if (dateValue instanceof Date) return dateValue
    if (typeof dateValue === 'string' || typeof dateValue === 'number') {
      const parsed = new Date(dateValue)
      return isNaN(parsed.getTime()) ? null : parsed
    }
    return null
  }

  const normalizeToDateOnly = (date: Date): Date => {
    const normalized = new Date(date)
    normalized.setHours(0, 0, 0, 0)
    return normalized
  }

  const date = parseDate(value)
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

const booleanFilter: FilterFn<unknown> = (row, columnId, filterValue: BooleanFilterValue) => {
  const value = row.getValue<boolean>(columnId)
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

const tagsFilter: FilterFn<unknown> = (row, columnId, filterValue: TagsFilterValue) => {
  const value = row.getValue<unknown[]>(columnId)
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

const genericFilter: FilterFn<unknown> = (row, columnId, filterValue: GenericFilterValue) => {
  const value = row.getValue<unknown>(columnId)
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

export const TableFilter = {
  text: textFilter,
  number: numberFilter,
  date: dateFilter,
  boolean: booleanFilter,
  tags: tagsFilter,
  generic: genericFilter,
}
