import type { DataType } from '../data-types'
import { FilterOperatorUtils } from '../filter-operator'
import { boolean, isBooleanParameterValid } from './boolean'
import { date, isDateParameterValid } from './date'
import { dateTime, isDateTimeParameterValid } from './dateTime'
import { multiTags, isMultiTagsParameterValid } from './multiTags'
import { number, isNumberParameterValid } from './number'
import { singleTag, isSingleTagParameterValid } from './singleTag'
import { text, isTextParameterValid } from './text'
import { unknownType, isUnknownTypeParameterValid } from './unknownType'
import type { FilterFn, FilterParameter, FilterValue } from './types'

export type { FilterFn, FilterParameter, FilterValue } from './types'
export { useFilterValueTranslation, type FilterValueTranslationOptions } from './translation'
export { text } from './text'
export { number } from './number'
export { date } from './date'
export { dateTime } from './dateTime'
export { boolean } from './boolean'
export { singleTag } from './singleTag'
export { multiTags } from './multiTags'
export { unknownType } from './unknownType'

export const FilterFunctions: Record<DataType, FilterFn> = {
  text,
  number,
  date,
  dateTime,
  boolean,
  singleTag,
  multiTags,
  unknownType,
}

function isParameterValidForOperator(
  dataType: DataType,
  operator: FilterValue['operator'],
  parameter: FilterParameter
): boolean {
  switch (dataType) {
  case 'text':
    return isTextParameterValid(operator, parameter)
  case 'number':
    return isNumberParameterValid(operator, parameter)
  case 'date':
    return isDateParameterValid(operator, parameter)
  case 'dateTime':
    return isDateTimeParameterValid(operator, parameter)
  case 'boolean':
    return isBooleanParameterValid(operator, parameter)
  case 'multiTags':
    return isMultiTagsParameterValid(operator, parameter)
  case 'singleTag':
    return isSingleTagParameterValid(operator, parameter)
  case 'unknownType':
    return isUnknownTypeParameterValid(operator, parameter)
  default:
    return false
  }
}

function isFilterValueValid(value: FilterValue): boolean {
  const allowed = FilterOperatorUtils.operatorsByCategory[value.dataType]
  if (!allowed?.includes(value.operator)) {
    return false
  }
  return isParameterValidForOperator(value.dataType, value.operator, value.parameter)
}

export const FilterValueUtils = {
  allowedOperatorsByDataType: FilterOperatorUtils.operatorsByCategory,
  isValid: isFilterValueValid,
}
