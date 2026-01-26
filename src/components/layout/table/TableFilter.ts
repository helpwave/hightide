import type { FilterFn } from '@tanstack/react-table'
import {
  filterText,
  filterNumber,
  filterDate,
  filterDatetime,
  filterBoolean,
  filterTags,
  filterTagsSingle,
  filterGeneric
} from '@/src/utils/filter'

export const TableFilterOperator = {
  text: ['textEquals', 'textNotEquals', 'textNotWhitespace', 'textContains', 'textNotContains', 'textStartsWith', 'textEndsWith'],
  number: ['numberEquals', 'numberNotEquals', 'numberGreaterThan', 'numberGreaterThanOrEqual', 'numberLessThan', 'numberLessThanOrEqual', 'numberBetween', 'numberNotBetween'],
  date: ['dateEquals', 'dateNotEquals', 'dateGreaterThan', 'dateGreaterThanOrEqual', 'dateLessThan', 'dateLessThanOrEqual', 'dateBetween', 'dateNotBetween'],
  datetime: ['datetimeEquals', 'datetimeNotEquals', 'datetimeGreaterThan', 'datetimeGreaterThanOrEqual', 'datetimeLessThan', 'datetimeLessThanOrEqual', 'datetimeBetween', 'datetimeNotBetween'],
  boolean: ['booleanIsTrue', 'booleanIsFalse'],
  tags: ['tagsEquals', 'tagsNotEquals', 'tagsContains', 'tagsNotContains'],
  tagsSingle: ['tagsSingleEquals', 'tagsSingleNotEquals', 'tagsSingleContains', 'tagsSingleNotContains'],
  generic: ['undefined', 'notUndefined']
} as const

export type TableGenericFilter = (typeof TableFilterOperator.generic)[number]
export type TableTextFilter = (typeof TableFilterOperator.text)[number] | TableGenericFilter
export type TableNumberFilter = (typeof TableFilterOperator.number)[number] | TableGenericFilter
export type TableDateFilter = (typeof TableFilterOperator.date)[number]| TableGenericFilter
export type TableDatetimeFilter = (typeof TableFilterOperator.datetime)[number] | TableGenericFilter
export type TableBooleanFilter = (typeof TableFilterOperator.boolean)[number] | TableGenericFilter
export type TableTagsFilter = (typeof TableFilterOperator.tags)[number] | TableGenericFilter
export type TableTagsSingleFilter = (typeof TableFilterOperator.tagsSingle)[number] | TableGenericFilter


export type TableFilterType = TableTextFilter | TableNumberFilter | TableDateFilter | TableDatetimeFilter
| TableBooleanFilter | TableTagsFilter | TableTagsSingleFilter | TableGenericFilter

export type TableFilterCategory = keyof typeof TableFilterOperator

export function isTableFilterCategory(value: unknown): value is TableFilterCategory {
  return typeof value === 'string' && value in TableFilterOperator
}

export type TextFilterParameter = {
  searchText?: string,
  isCaseSensitive?: boolean,
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

export type DatetimeFilterParameter = {
  compareDatetime?: Date,
  min?: Date,
  max?: Date,
}

export type BooleanFilterParameter = Record<string, never>

export type TagsFilterParameter = {
  searchTags?: unknown[],
}

export type TagsSingleFilterParameter = {
  searchTag?: unknown,
  searchTagsContains?: unknown[],
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

export type DatetimeFilterValue = {
  operator: TableDatetimeFilter,
  parameter: DatetimeFilterParameter,
}

export type BooleanFilterValue = {
  operator: TableBooleanFilter,
  parameter: BooleanFilterParameter,
}

export type TagsFilterValue = {
  operator: TableTagsFilter,
  parameter: TagsFilterParameter,
}

export type TagsSingleFilterValue = {
  operator: TableTagsSingleFilter,
  parameter: TagsSingleFilterParameter,
}

export type GenericFilterValue = {
  operator: TableGenericFilter,
  parameter: GenericFilterParameter,
}

export type TableFilterValue = TextFilterValue | NumberFilterValue | DateFilterValue | DatetimeFilterValue
| BooleanFilterValue | TagsFilterValue | TagsSingleFilterValue | GenericFilterValue

const textFilter: FilterFn<unknown> = (row, columnId, filterValue: TextFilterValue) => {
  const value = row.getValue<string>(columnId)
  return filterText(value, filterValue)
}

const numberFilter: FilterFn<unknown> = (row, columnId, filterValue: NumberFilterValue) => {
  const value = row.getValue<number>(columnId)
  return filterNumber(value, filterValue)
}

const dateFilter: FilterFn<unknown> = (row, columnId, filterValue: DateFilterValue) => {
  const value = row.getValue<Date>(columnId)
  return filterDate(value, filterValue)
}

const datetimeFilter: FilterFn<unknown> = (row, columnId, filterValue: DatetimeFilterValue) => {
  const value = row.getValue<Date>(columnId)
  return filterDatetime(value, filterValue)
}

const booleanFilter: FilterFn<unknown> = (row, columnId, filterValue: BooleanFilterValue) => {
  const value = row.getValue<boolean>(columnId)
  return filterBoolean(value, filterValue)
}

const tagsFilter: FilterFn<unknown> = (row, columnId, filterValue: TagsFilterValue) => {
  const value = row.getValue<unknown[]>(columnId)
  return filterTags(value, filterValue)
}

const tagsSingleFilter: FilterFn<unknown> = (row, columnId, filterValue: TagsSingleFilterValue) => {
  const value = row.getValue<unknown>(columnId)
  return filterTagsSingle(value, filterValue)
}
const genericFilter: FilterFn<unknown> = (row, columnId, filterValue: GenericFilterValue) => {
  const value = row.getValue<unknown>(columnId)
  return filterGeneric(value, filterValue)
}

export const TableFilter = {
  text: textFilter,
  number: numberFilter,
  date: dateFilter,
  datetime: datetimeFilter,
  boolean: booleanFilter,
  tags: tagsFilter,
  tagsSingle: tagsSingleFilter,
  generic: genericFilter,
}
