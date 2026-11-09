import type { DataType } from '../data-types'
import type { FilterOperator } from '../filter-operator'

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

export type FilterValue = {
  dataType: DataType,
  operator: FilterOperator,
  parameter: FilterParameter,
}

export type FilterFn = (value: unknown, operator: FilterOperator, parameter: FilterParameter) => boolean
