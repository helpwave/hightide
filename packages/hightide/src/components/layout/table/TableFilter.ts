import type { FilterFn } from '@tanstack/react-table'
import { FilterOperatorUtils } from '../../user-interaction/data/FilterOperator'
import { FilterFunctions, type FilterValue } from '../../user-interaction/data/filter-function'


const textFilter: FilterFn<unknown> = (row, columnId, filterValue: FilterValue) => {
  const value = row.getValue<string>(columnId)
  const operator = filterValue.operator
  if (!FilterOperatorUtils.typeCheck.text(operator)) {
    return true
  }
  return FilterFunctions.text(value, operator, filterValue.parameter)
}

const numberFilter: FilterFn<unknown> = (row, columnId, filterValue: FilterValue) => {
  const value = row.getValue<number>(columnId)
  const operator = filterValue.operator
  if (!FilterOperatorUtils.typeCheck.number(operator)) {
    return true
  }
  return FilterFunctions.number(value, operator, filterValue.parameter)
}

const dateFilter: FilterFn<unknown> = (row, columnId, filterValue: FilterValue) => {
  const value = row.getValue<Date>(columnId)
  const operator = filterValue.operator
  if (!FilterOperatorUtils.typeCheck.date(operator)) {
    return true
  }
  return FilterFunctions.date(value, operator, filterValue.parameter)
}

const dateTimeFilter: FilterFn<unknown> = (row, columnId, filterValue: FilterValue) => {
  const value = row.getValue<Date>(columnId)
  const operator = filterValue.operator
  if (!FilterOperatorUtils.typeCheck.datetime(operator)) {
    return true
  }
  return FilterFunctions.dateTime(value, operator, filterValue.parameter)
}

const booleanFilter: FilterFn<unknown> = (row, columnId, filterValue: FilterValue) => {
  const value = row.getValue<boolean>(columnId)
  const operator = filterValue.operator
  if (!FilterOperatorUtils.typeCheck.boolean(operator)) {
    return true
  }
  return FilterFunctions.boolean(value, operator, filterValue.parameter)
}

const multiTagsFilter: FilterFn<unknown> = (row, columnId, filterValue: FilterValue) => {
  const value = row.getValue<unknown[]>(columnId)
  const operator = filterValue.operator
  if (!FilterOperatorUtils.typeCheck.tags(operator)) {
    return true
  }
  return FilterFunctions.multiTags(value, operator, filterValue.parameter)
}

const singleTagFilter: FilterFn<unknown> = (row, columnId, filterValue: FilterValue) => {
  const value = row.getValue<unknown>(columnId)
  const operator = filterValue.operator
  if (!FilterOperatorUtils.typeCheck.tagsSingle(operator)) {
    return true
  }
  return FilterFunctions.singleTag(value, operator, filterValue.parameter)
}

const unknownTypeFilter: FilterFn<unknown> = (row, columnId, filterValue: FilterValue) => {
  const value = row.getValue<unknown>(columnId)
  const operator = filterValue.operator
  if (!FilterOperatorUtils.typeCheck.unknownType(operator)) {
    return true
  }
  return FilterFunctions.unknownType(value, operator, filterValue.parameter)
}

export const TableFilter = {
  text: textFilter,
  number: numberFilter,
  date: dateFilter,
  dateTime: dateTimeFilter,
  boolean: booleanFilter,
  multiTags: multiTagsFilter,
  singleTag: singleTagFilter,
  unknownType: unknownTypeFilter,
}
