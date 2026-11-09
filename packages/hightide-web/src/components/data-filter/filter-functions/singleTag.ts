import type { FilterOperator } from '../filter-operator'
import { OPERATORS_WITHOUT_PARAMETERS } from '../filter-operator'
import type { FilterFn, FilterParameter } from './types'

export function isSingleTagParameterValid(operator: FilterOperator, parameter: FilterParameter): boolean {
  if (OPERATORS_WITHOUT_PARAMETERS.includes(operator)) {
    return true
  }
  if (operator === 'contains' || operator === 'notContains') {
    return Array.isArray(parameter.uuidValues)
  }
  if (operator === 'equals' || operator === 'notEquals') {
    return typeof parameter.uuidValue === 'string'
  }
  return true
}

export const singleTag: FilterFn = (value, operator, parameter) => {
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
