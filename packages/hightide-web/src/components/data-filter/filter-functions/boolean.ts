import type { FilterFn, FilterParameter } from './types'
import type { FilterOperator } from '../filter-operator'

export function isBooleanParameterValid(_operator: FilterOperator, _parameter: FilterParameter): boolean {
  return true
}

export const boolean: FilterFn = (value, operator) => {
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
