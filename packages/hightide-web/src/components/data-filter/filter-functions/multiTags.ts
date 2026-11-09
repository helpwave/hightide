import type { FilterOperator } from '../filter-operator'
import { OPERATORS_WITHOUT_PARAMETERS } from '../filter-operator'
import type { FilterFn, FilterParameter } from './types'

export function isMultiTagsParameterValid(operator: FilterOperator, parameter: FilterParameter): boolean {
  if (OPERATORS_WITHOUT_PARAMETERS.includes(operator)) {
    return true
  }
  return Array.isArray(parameter.uuidValues)
}

export const multiTags: FilterFn = (value, operator, parameter) => {
  switch (operator) {
  case 'equals': {
    if (!Array.isArray(value) || !Array.isArray(parameter.uuidValues)) return false
    if (value.length !== parameter.uuidValues.length) return false
    const valueSet = new Set(value)
    const searchTagsSet = new Set(parameter.uuidValues)
    if (valueSet.size !== searchTagsSet.size) return false
    return Array.from(valueSet).every(tag => searchTagsSet.has(tag))
  }
  case 'notEquals': {
    if (!Array.isArray(value) || !Array.isArray(parameter.uuidValues)) return true
    if (value.length !== parameter.uuidValues.length) return true
    const valueSet = new Set(value)
    const searchTagsSet = new Set(parameter.uuidValues)
    if (valueSet.size !== searchTagsSet.size) return true
    return !Array.from(valueSet).every(tag => searchTagsSet.has(tag))
  }
  case 'contains': {
    if (!Array.isArray(value) || !Array.isArray(parameter.uuidValues)) return false
    return parameter.uuidValues.every(tag => value.includes(tag))
  }
  case 'notContains': {
    if (!Array.isArray(value) || !Array.isArray(parameter.uuidValues)) return true
    return !parameter.uuidValues.every(tag => value.includes(tag))
  }
  case 'isUndefined':
    return value === undefined || value === null
  case 'isNotUndefined':
    return value !== undefined && value !== null
  default:
    return false
  }
}
