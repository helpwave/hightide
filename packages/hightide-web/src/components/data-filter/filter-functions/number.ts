import type { FilterOperator } from '../filter-operator'
import { OPERATORS_WITHOUT_PARAMETERS } from '../filter-operator'
import type { FilterFn, FilterParameter } from './types'

export function isNumberParameterValid(operator: FilterOperator, parameter: FilterParameter): boolean {
  if (OPERATORS_WITHOUT_PARAMETERS.includes(operator)) {
    return true
  }
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

export const number: FilterFn = (value, operator, parameter) => {
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
