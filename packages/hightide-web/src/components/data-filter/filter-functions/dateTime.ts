import { DateUtils } from '@helpwave/hightide-utils/utils'
import type { FilterOperator } from '../filter-operator'
import { OPERATORS_WITHOUT_PARAMETERS } from '../filter-operator'
import type { FilterFn, FilterParameter } from './types'

export function isDateTimeParameterValid(operator: FilterOperator, parameter: FilterParameter): boolean {
  if (OPERATORS_WITHOUT_PARAMETERS.includes(operator)) {
    return true
  }
  if (operator === 'between' || operator === 'notBetween') {
    const minDate = DateUtils.tryParseDate(parameter.dateMin)
    const maxDate = DateUtils.tryParseDate(parameter.dateMax)
    if (!minDate || !maxDate) return false
    return DateUtils.toDateTimeOnly(minDate).getTime() <= DateUtils.toDateTimeOnly(maxDate).getTime()
  }
  return DateUtils.tryParseDate(parameter.dateValue) != null
}

export const dateTime: FilterFn = (value, operator, parameter) => {
  const dateTimeValue = DateUtils.tryParseDate(value as Date | string | number | undefined | null)
  if (!dateTimeValue) {
    if (operator === 'isUndefined') {
      return value === undefined || value === null
    }
    if (operator === 'isNotUndefined') {
      return value !== undefined && value !== null
    }
    return false
  }

  const normalizedDatetime = DateUtils.toDateTimeOnly(dateTimeValue)

  switch (operator) {
  case 'equals': {
    const filterDatetime = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDatetime) return false
    return normalizedDatetime.getTime() === DateUtils.toDateTimeOnly(filterDatetime).getTime()
  }
  case 'notEquals': {
    const filterDatetime = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDatetime) return false
    return normalizedDatetime.getTime() !== DateUtils.toDateTimeOnly(filterDatetime).getTime()
  }
  case 'greaterThan': {
    const filterDatetime = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDatetime) return false
    return normalizedDatetime > DateUtils.toDateTimeOnly(filterDatetime)
  }
  case 'greaterThanOrEqual': {
    const filterDatetime = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDatetime) return false
    return normalizedDatetime >= DateUtils.toDateTimeOnly(filterDatetime)
  }
  case 'lessThan': {
    const filterDatetime = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDatetime) return false
    return normalizedDatetime < DateUtils.toDateTimeOnly(filterDatetime)
  }
  case 'lessThanOrEqual': {
    const filterDatetime = DateUtils.tryParseDate(parameter.dateValue)
    if (!filterDatetime) return false
    return normalizedDatetime <= DateUtils.toDateTimeOnly(filterDatetime)
  }
  case 'between': {
    const minDatetime = DateUtils.tryParseDate(parameter.dateMin)
    const maxDatetime = DateUtils.tryParseDate(parameter.dateMax)
    if (!minDatetime || !maxDatetime) return false
    return normalizedDatetime >= DateUtils.toDateTimeOnly(minDatetime) && normalizedDatetime <= DateUtils.toDateTimeOnly(maxDatetime)
  }
  case 'notBetween': {
    const minDatetime = DateUtils.tryParseDate(parameter.dateMin)
    const maxDatetime = DateUtils.tryParseDate(parameter.dateMax)
    if (!minDatetime || !maxDatetime) return false
    return normalizedDatetime < DateUtils.toDateTimeOnly(minDatetime) || normalizedDatetime > DateUtils.toDateTimeOnly(maxDatetime)
  }
  default:
    return false
  }
}
