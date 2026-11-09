import { DateUtils } from '@helpwave/hightide-utils/utils'
import type { FilterOperator } from '../filter-operator'
import { OPERATORS_WITHOUT_PARAMETERS } from '../filter-operator'
import type { FilterFn, FilterParameter } from './types'

export function isDateParameterValid(operator: FilterOperator, parameter: FilterParameter): boolean {
  if (OPERATORS_WITHOUT_PARAMETERS.includes(operator)) {
    return true
  }
  if (operator === 'between' || operator === 'notBetween') {
    const minDate = DateUtils.tryParseDate(parameter.dateMin)
    const maxDate = DateUtils.tryParseDate(parameter.dateMax)
    if (!minDate || !maxDate) return false
    return DateUtils.toOnlyDate(minDate).getTime() <= DateUtils.toOnlyDate(maxDate).getTime()
  }
  return DateUtils.tryParseDate(parameter.dateValue) != null
}

export const date: FilterFn = (value, operator, parameter) => {
  const parsed = DateUtils.tryParseDate(value as Date | string | number | undefined | null)
  if (!parsed) {
    if (operator === 'isUndefined') {
      return value === undefined || value === null
    }
    if (operator === 'isNotUndefined') {
      return value !== undefined && value !== null
    }
    return false
  }

  const normalizedDate = DateUtils.toOnlyDate(parsed)

  switch (operator) {
  case 'equals': {
    const filterDateValue = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDateValue) return false
    return normalizedDate.getTime() === DateUtils.toOnlyDate(filterDateValue).getTime()
  }
  case 'notEquals': {
    const filterDateValue = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDateValue) return false
    return normalizedDate.getTime() !== DateUtils.toOnlyDate(filterDateValue).getTime()
  }
  case 'greaterThan': {
    const filterDateValue = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDateValue) return false
    return normalizedDate > DateUtils.toOnlyDate(filterDateValue)
  }
  case 'greaterThanOrEqual': {
    const filterDateValue = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDateValue) return false
    return normalizedDate >= DateUtils.toOnlyDate(filterDateValue)
  }
  case 'lessThan': {
    const filterDateValue = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDateValue) return false
    return normalizedDate < DateUtils.toOnlyDate(filterDateValue)
  }
  case 'lessThanOrEqual': {
    const filterDateValue = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDateValue) return false
    return normalizedDate <= DateUtils.toOnlyDate(filterDateValue)
  }
  case 'between': {
    const minDate = DateUtils.tryParseDate(parameter.dateMin)
    const maxDate = DateUtils.tryParseDate(parameter.dateMax)
    if (!minDate || !maxDate) return false
    return normalizedDate >= DateUtils.toOnlyDate(minDate) && normalizedDate <= DateUtils.toOnlyDate(maxDate)
  }
  case 'notBetween': {
    const minDate = DateUtils.tryParseDate(parameter.dateMin)
    const maxDate = DateUtils.tryParseDate(parameter.dateMax)
    if (!minDate || !maxDate) return false
    return normalizedDate < DateUtils.toOnlyDate(minDate) || normalizedDate > DateUtils.toOnlyDate(maxDate)
  }
  default:
    return false
  }
}
