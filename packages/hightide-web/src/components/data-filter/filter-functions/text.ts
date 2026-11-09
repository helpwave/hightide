import type { FilterOperator } from '../filter-operator'
import { OPERATORS_WITHOUT_PARAMETERS } from '../filter-operator'
import type { FilterFn, FilterParameter } from './types'

export function isTextParameterValid(operator: FilterOperator, parameter: FilterParameter): boolean {
  if (OPERATORS_WITHOUT_PARAMETERS.includes(operator)) {
    return true
  }
  return typeof parameter.stringValue === 'string'
}

export const text: FilterFn = (value, operator, parameter) => {
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
