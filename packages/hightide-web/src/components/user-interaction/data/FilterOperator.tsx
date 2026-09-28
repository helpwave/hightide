import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Equal,
  EqualNot,
  SearchCheck,
  SearchX,
  CircleDashed,
  CircleDot
} from 'lucide-react'
import { Icon } from '../../display-and-visualization/Icon'
import type { DataType } from './data-types'
import type { ReactNode } from 'react'

const filterOperators = [
  'equals', 'notEquals', 'contains', 'notContains', 'startsWith', 'endsWith',
  'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'notBetween',
  'isTrue', 'isFalse',
  'isUndefined', 'isNotUndefined'
] as const

export type FilterOperator = (typeof filterOperators)[number]

const filterOperatorsByCategory: Record<DataType, FilterOperator[]> = {
  text: ['equals', 'notEquals', 'contains', 'notContains', 'startsWith', 'endsWith', 'isUndefined', 'isNotUndefined'],
  number: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'notBetween', 'isUndefined', 'isNotUndefined'],
  date: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'notBetween', 'isUndefined', 'isNotUndefined'],
  dateTime: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'notBetween', 'isUndefined', 'isNotUndefined'],
  boolean: ['isTrue', 'isFalse', 'isUndefined', 'isNotUndefined'],
  multiTags: ['equals', 'notEquals', 'contains', 'notContains', 'isUndefined', 'isNotUndefined'],
  singleTag: ['equals', 'notEquals', 'contains', 'notContains', 'isUndefined', 'isNotUndefined'],
  unknownType: ['isUndefined', 'isNotUndefined'],
} as const

export type FilterOperatorUnknownType = (typeof filterOperatorsByCategory.unknownType)[number]
export type FilterOperatorText = (typeof filterOperatorsByCategory.text)[number]
export type FilterOperatorNumber = (typeof filterOperatorsByCategory.number)[number]
export type FilterOperatorDate = (typeof filterOperatorsByCategory.date)[number]
export type FilterOperatorDatetime = (typeof filterOperatorsByCategory.dateTime)[number]
export type FilterOperatorBoolean = (typeof filterOperatorsByCategory.boolean)[number]
export type FilterOperatorTags = (typeof filterOperatorsByCategory.multiTags)[number]
export type FilterOperatorTagsSingle = (typeof filterOperatorsByCategory.singleTag)[number]

function isFilterOperatorText(value: unknown): value is FilterOperatorText {
  return typeof value === 'string' && filterOperatorsByCategory.text.some(o => o === value)
}

function isFilterOperatorNumber(value: unknown): value is FilterOperatorNumber {
  return typeof value === 'string' && filterOperatorsByCategory.number.some(o => o === value)
}

function isFilterOperatorDate(value: unknown): value is FilterOperatorDate {
  return typeof value === 'string' && filterOperatorsByCategory.date.some(o => o === value)
}

function isFilterOperatorDatetime(value: unknown): value is FilterOperatorDatetime {
  return typeof value === 'string' && filterOperatorsByCategory.dateTime.some(o => o === value)
}

function isFilterOperatorBoolean(value: unknown): value is FilterOperatorBoolean {
  return typeof value === 'string' && filterOperatorsByCategory.boolean.some(o => o === value)
}

function isFilterOperatorTags(value: unknown): value is FilterOperatorTags {
  return typeof value === 'string' && filterOperatorsByCategory.multiTags.some(o => o === value)
}

function isFilterOperatorTagsSingle(value: unknown): value is FilterOperatorTagsSingle {
  return typeof value === 'string' && filterOperatorsByCategory.singleTag.some(o => o === value)
}

function isFilterOperatorUnknownType(value: unknown): value is FilterOperatorUnknownType {
  return typeof value === 'string' && filterOperatorsByCategory.unknownType.some(o => o === value)
}

function isFilterOperator(value: unknown): value is FilterOperator {
  return typeof value === 'string' && filterOperators.some(o => o === value)
}

type OperatorInfoResult = {
  icon: ReactNode,
  translationKey: string,
  replacementTranslationKey: string,
}
const getOperatorInfo = (operator: FilterOperator) : OperatorInfoResult  => {
  switch (operator) {
  case 'equals': return { icon: <Icon icon={Equal} size="xs" />, translationKey: 'equals', replacementTranslationKey: 'rEquals' }
  case 'notEquals': return { icon: <Icon icon={EqualNot} size="xs" />, translationKey: 'notEquals', replacementTranslationKey: 'rNotEquals' }
  case 'contains': return { icon: <Icon icon={SearchCheck} size="xs" />, translationKey: 'contains', replacementTranslationKey: 'rContains' }
  case 'notContains': return { icon: <Icon icon={SearchX} size="xs" />, translationKey: 'notContains', replacementTranslationKey: 'rNotContains' }
  case 'startsWith': return { icon: <Icon icon={SearchCheck} size="xs" />, translationKey: 'startsWith', replacementTranslationKey: 'rStartsWith' }
  case 'endsWith': return { icon: <Icon icon={SearchX} size="xs" />, translationKey: 'endsWith', replacementTranslationKey: 'rEndsWith' }
  case 'greaterThan': return {
    icon: (<div className="flex-row-0 items-center">
      <Icon icon={ChevronRight} size="xs" />
      <Icon icon={Equal} size="xs" className="-ml-1" />
    </div>
    ),
    translationKey: 'greaterThanOrEqual',
    replacementTranslationKey: 'rGreaterThanOrEqual'
  }
  case 'greaterThanOrEqual': return {
    icon: (<div className="flex-row-0 items-center">
      <Icon icon={ChevronRight} size="xs" />
      <Icon icon={Equal} size="xs" className="-ml-1" />
    </div>
    ),
    translationKey: 'greaterThanOrEqual',
    replacementTranslationKey: 'rGreaterThanOrEqual'
  }
  case 'lessThan': return {
    icon: <Icon icon={ChevronLeft} size="xs" />,
    translationKey: 'lessThan',
    replacementTranslationKey: 'rLessThan'
  }
  case 'lessThanOrEqual': return {
    icon: (<div className="flex-row-0 items-center">
      <Icon icon={ChevronLeft} size="xs" />
      <Icon icon={Equal} size="xs" className="-ml-1" />
    </div>
    ),
    translationKey: 'lessThanOrEqual',
    replacementTranslationKey: 'rLessThanOrEqual'
  }
  case 'between': return {
    icon: (<div className="flex-row-0 items-center">
      <Icon icon={ChevronRight} size="xs" />
      <Icon icon={ChevronLeft} size="xs" className="-ml-1" />
    </div>
    ),
    translationKey: 'between',
    replacementTranslationKey: 'rBetween'
  }
  case 'notBetween': return {
    icon: (<div className="flex-row-0 items-center">
      <Icon icon={ChevronLeft} size="xs" />
      <Icon icon={ChevronRight} size="xs" className="-ml-1" />
    </div>
    ),
    translationKey: 'notBetween',
    replacementTranslationKey: 'rNotBetween'
  }
  case 'isTrue': return { icon: <Icon icon={CheckCircle2} size="xs" />, translationKey: 'isTrue', replacementTranslationKey: 'isTrue' }
  case 'isFalse': return { icon: <Icon icon={XCircle} size="xs" />, translationKey: 'isFalse', replacementTranslationKey: 'isFalse' }
  case 'isUndefined': return { icon: <Icon icon={CircleDashed} size="xs" />, translationKey: 'isUndefined', replacementTranslationKey: 'isUndefined' }
  case 'isNotUndefined': return { icon: <Icon icon={CircleDot} size="xs" />, translationKey: 'isNotUndefined', replacementTranslationKey: 'isNotUndefined' }
  default: return { icon: null, translationKey: 'unknown translation key', replacementTranslationKey: 'unknown' }
  }
}

function getDefaultOperator(dataType: DataType): FilterOperator {
  switch (dataType) {
  case 'text': return 'contains'
  case 'number': return 'between'
  case 'date': return 'between'
  case 'dateTime': return 'between'
  case 'boolean': return 'isTrue'
  case 'multiTags': return 'contains'
  case 'singleTag': return 'contains'
  case 'unknownType': return 'isNotUndefined'
  }
}



export const FilterOperatorUtils = {
  operators: filterOperators,
  operatorsByCategory: filterOperatorsByCategory,
  getInfo: getOperatorInfo,
  getDefaultOperator,
  typeCheck: {
    all: isFilterOperator,
    text: isFilterOperatorText,
    number: isFilterOperatorNumber,
    date: isFilterOperatorDate,
    datetime: isFilterOperatorDatetime,
    boolean: isFilterOperatorBoolean,
    tags: isFilterOperatorTags,
    tagsSingle: isFilterOperatorTagsSingle,
    unknownType: isFilterOperatorUnknownType,
  },
}
