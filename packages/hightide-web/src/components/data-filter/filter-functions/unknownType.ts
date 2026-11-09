import type { FilterFn, FilterParameter } from './types'
import type { FilterOperator } from '../filter-operator'

export function isUnknownTypeParameterValid(_operator: FilterOperator, _parameter: FilterParameter): boolean {
  return true
}

export const unknownType: FilterFn = (value, operator) => {
  switch (operator) {
  case 'isUndefined':
    return value === undefined || value === null
  case 'isNotUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}
