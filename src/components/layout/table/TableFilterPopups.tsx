import { Input } from '../../user-interaction/input/Input'
import { DateTimeInput } from '../../user-interaction/input/DateTimeInput'
import { FormFieldLayout } from '../../form/FieldLayout'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { useId, useMemo, useState } from 'react'
import type {
  TableTextFilter,
  TableNumberFilter,
  TableDateFilter,
  TableBooleanFilter,
  TableTagsFilter,
  TableGenericFilter,
  TextFilterValue,
  NumberFilterValue,
  DateFilterValue,
  BooleanFilterValue,
  TagsFilterValue,
  GenericFilterValue,
  TableFilterValue,
  TableFilterCategory,
  DatetimeFilterValue,
  TableDatetimeFilter,
  TagsSingleFilterValue,
  TableTagsSingleFilter
} from './TableFilter'
import { TableFilterOperator } from './TableFilter'
import { Select } from '../../user-interaction/select/Select'
import { SelectOption } from '../../user-interaction/select/SelectComponents'
import { MultiSelect } from '../../user-interaction/select/MultiSelect'
import { MultiSelectOption } from '../../user-interaction/select/SelectComponents'
import { Visibility } from '../Visibility'
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Equal,
  EqualNot,
  TextInitial,
  SearchCheck,
  SearchX,
  CircleDashed,
  CircleDot
} from 'lucide-react'
import type { TableFilterType } from './TableFilter'
import { useTableDataContext } from './TableContext'
import { Checkbox } from '../../user-interaction/Checkbox'

export interface TableFilterBaseProps<T extends TableFilterValue> {
  columnId: string,
  filterValue?: T | undefined,
  onFilterValueChange: (value: T | undefined) => void,
}

const getOperatorInfo = (operator: TableFilterType) => {
  switch (operator) {
  case 'textEquals': return { icon: <Equal className="w-4 h-4" />, translationKey: 'equals' }
  case 'textNotEquals': return { icon: <EqualNot className="w-4 h-4" />, translationKey: 'notEquals' }
  case 'textNotWhitespace': return { icon: <TextInitial className="w-4 h-4" />, translationKey: 'filterNonWhitespace' }
  case 'textContains': return { icon: <SearchCheck className="w-4 h-4" />, translationKey: 'contains' }
  case 'textNotContains': return { icon: <SearchX className="w-4 h-4" />, translationKey: 'notContains' }
  case 'textStartsWith': return { icon: <ArrowRight className="w-4 h-4" />, translationKey: 'startsWith' }
  case 'textEndsWith': return { icon: <ArrowLeft className="w-4 h-4" />, translationKey: 'endsWith' }
  case 'numberEquals': return { icon: <Equal className="w-4 h-4" />, translationKey: 'equals' }
  case 'numberNotEquals': return { icon: <EqualNot className="w-4 h-4" />, translationKey: 'notEquals' }
  case 'numberGreaterThan': return { icon: <ChevronRight className="w-4 h-4" />, translationKey: 'greaterThan' }
  case 'numberGreaterThanOrEqual': return {
    icon: (<div className="flex-row-0 items-center">
      <ChevronRight className="w-4 h-4" />
      <Equal className="-ml-1 w-4 h-4" />
    </div>
    ),
    translationKey: 'greaterThanOrEqual'
  }
  case 'numberLessThan': return { icon: <ChevronLeft className="w-4 h-4" />, translationKey: 'lessThan' }
  case 'numberLessThanOrEqual': return {
    icon: (<div className="flex-row-0 items-center">
      <ChevronLeft className="w-4 h-4" />
      <Equal className="-ml-1 w-4 h-4" />
    </div>
    ),
    translationKey: 'lessThanOrEqual'
  }
  case 'numberBetween': return {
    icon: (<div className="flex-row-0 items-center">
      <ChevronRight className="w-4 h-4" />
      <ChevronLeft className="-ml-1 w-4 h-4" />
    </div>
    ),
    translationKey: 'between'
  }
  case 'numberNotBetween': return {
    icon: (<div className="flex-row-0 items-center">
      <ChevronLeft className="w-4 h-4" />
      <ChevronRight className="-ml-1 w-4 h-4" />
    </div>
    ),
    translationKey: 'notBetween'
  }
  case 'dateEquals': return { icon: <Equal className="w-4 h-4" />, translationKey: 'equals' }
  case 'dateNotEquals': return { icon: <EqualNot className="w-4 h-4" />, translationKey: 'notEquals' }
  case 'dateGreaterThan': return { icon: <ChevronRight className="w-4 h-4" />, translationKey: 'after' }
  case 'dateGreaterThanOrEqual': return {
    icon: (<div className="flex-row-0 items-center">
      <ChevronRight className="w-4 h-4" />
      <Equal className="-ml-1 w-4 h-4" />
    </div>
    ),
    translationKey: 'onOrAfter'
  }
  case 'dateLessThan': return { icon: <ChevronLeft className="w-4 h-4" />, translationKey: 'before' }
  case 'dateLessThanOrEqual': return {
    icon: (<div className="flex-row-0 items-center">
      <ChevronLeft className="w-4 h-4" />
      <Equal className="-ml-1 w-4 h-4" />
    </div>
    ),
    translationKey: 'onOrBefore'
  }
  case 'dateBetween': return {
    icon: (<div className="flex-row-0 items-center">
      <ChevronRight className="w-4 h-4" />
      <ChevronLeft className="-ml-1 w-4 h-4" />
    </div>
    ),
    translationKey: 'between'
  }
  case 'dateNotBetween': return {
    icon: (<div className="flex-row-0 items-center">
      <ChevronLeft className="w-4 h-4" />
      <ChevronRight className="-ml-1 w-4 h-4" />
    </div>
    ),
    translationKey: 'notBetween'
  }
  case 'booleanIsTrue': return { icon: <CheckCircle2 className="w-4 h-4" />, translationKey: 'isTrue' }
  case 'booleanIsFalse': return { icon: <XCircle className="w-4 h-4" />, translationKey: 'isFalse' }
  case 'tagsEquals': return { icon: <Equal className="w-4 h-4" />, translationKey: 'equals' }
  case 'tagsNotEquals': return { icon: <EqualNot className="w-4 h-4" />, translationKey: 'notEquals' }
  case 'tagsContains': return { icon: <SearchCheck className="w-4 h-4" />, translationKey: 'contains' }
  case 'tagsNotContains': return { icon: <SearchX className="w-4 h-4" />, translationKey: 'notContains' }
  case 'dateTimeEquals': return { icon: <Equal className="w-4 h-4" />, translationKey: 'equals' }
  case 'dateTimeNotEquals': return { icon: <EqualNot className="w-4 h-4" />, translationKey: 'notEquals' }
  case 'dateTimeGreaterThan': return { icon: <ChevronRight className="w-4 h-4" />, translationKey: 'after' }
  case 'dateTimeGreaterThanOrEqual': return {
    icon: (<div className="flex-row-0 items-center">
      <ChevronRight className="w-4 h-4" />
      <Equal className="-ml-1 w-4 h-4" />
    </div>
    ),
    translationKey: 'onOrAfter'
  }
  case 'dateTimeLessThan': return { icon: <ChevronLeft className="w-4 h-4" />, translationKey: 'before' }
  case 'dateTimeLessThanOrEqual': return {
    icon: (<div className="flex-row-0 items-center">
      <ChevronLeft className="w-4 h-4" />
      <Equal className="-ml-1 w-4 h-4" />
    </div>
    ),
    translationKey: 'onOrBefore'
  }
  case 'dateTimeBetween': return {
    icon: (<div className="flex-row-0 items-center">
      <ChevronRight className="w-4 h-4" />
      <ChevronLeft className="-ml-1 w-4 h-4" />
    </div>
    ),
    translationKey: 'between'
  }
  case 'dateTimeNotBetween': return {
    icon: (<div className="flex-row-0 items-center">
      <ChevronLeft className="w-4 h-4" />
      <ChevronRight className="-ml-1 w-4 h-4" />
    </div>
    ),
    translationKey: 'notBetween'
  }
  case 'tagsSingleEquals': return { icon: <Equal className="w-4 h-4" />, translationKey: 'equals' }
  case 'tagsSingleNotEquals': return { icon: <EqualNot className="w-4 h-4" />, translationKey: 'notEquals' }
  case 'tagsSingleContains': return { icon: <SearchCheck className="w-4 h-4" />, translationKey: 'contains' }
  case 'tagsSingleNotContains': return { icon: <SearchX className="w-4 h-4" />, translationKey: 'notContains' }
  case 'undefined': return { icon: <CircleDashed className="w-4 h-4" />, translationKey: 'filterUndefined' }
  case 'notUndefined': return { icon: <CircleDot className="w-4 h-4" />, translationKey: 'filterNotUndefined' }
  default: return { icon: null, translationKey: 'undefined translation' }
  }
}

export type OperatorLabelProps = {
  operator: TableFilterType,
}

export const OperatorLabel = ({ operator }: OperatorLabelProps) => {
  const translation = useHightideTranslation()
  const { icon, translationKey } = getOperatorInfo(operator)
  const label = typeof translationKey === 'string' ? translation(translationKey) : translationKey

  return (
    <div className="flex-row-1 items-center gap-2">
      {icon}
      {label}
    </div>
  )
}

export type TextFilterProps = TableFilterBaseProps<TextFilterValue>

export const TextFilter = ({ filterValue, onFilterValueChange }: TextFilterProps) => {
  const translation = useHightideTranslation()
  const operator = filterValue?.operator ?? 'textContains'
  const parameter = filterValue?.parameter ?? {}
  const id = useId()

  const availableOperators = useMemo(() => [
    ...TableFilterOperator.text,
    ...TableFilterOperator.generic,
  ], [])

  const needsParameterInput = !['textNotWhitespace', 'undefined', 'notUndefined'].includes(operator)

  return (
    <div className="flex-col-2 gap-2">
      <Select
        value={operator}
        onValueChange={(newOperator) => {
          onFilterValueChange({
            operator: newOperator as TableTextFilter,
            parameter: needsParameterInput ? parameter : {},
          })
        }}
        buttonProps={{ className: 'min-w-64' }}
      >
        {availableOperators.map((op) => (
          <SelectOption key={op} value={op} iconAppearance="right">
            <OperatorLabel operator={op} />
          </SelectOption>
        ))}
      </Select>
      <span className="typography-label-lg font-semibold">{translation('parameter')}</span>
      <Visibility isVisible={needsParameterInput}>
        <Input
          value={parameter.searchText ?? ''}
          placeholder={translation('search') + '...'}
          onValueChange={searchText => {
            onFilterValueChange({
              operator,
              parameter: { ...parameter, searchText },
            })
          }}
          className="min-w-64"
        />
        <div className="flex-row-2 items-center gap-2">
          <Checkbox
            id={id}
            value={parameter.isCaseSensitive ?? false}
            onValueChange={isCaseSensitive => {
              onFilterValueChange({
                operator,
                parameter: { ...parameter, isCaseSensitive },
              })
            }}
          />
          <label htmlFor={id}>{translation('caseSensitive')}</label>
        </div>
      </Visibility>
      <Visibility isVisible={!needsParameterInput}>
        <span className="text-sm text-description h-10">
          {translation('noParameterRequired')}
        </span>
      </Visibility>
    </div>
  )
}

export type NumberFilterProps = TableFilterBaseProps<NumberFilterValue>

export const NumberFilter = ({ filterValue, onFilterValueChange }: NumberFilterProps) => {
  const translation = useHightideTranslation()
  const operator = filterValue?.operator ?? 'numberBetween'
  const parameter = filterValue?.parameter ?? {}

  const availableOperators = useMemo(() => [
    ...TableFilterOperator.number,
    ...TableFilterOperator.generic,
  ], [])

  const needsRangeInput = operator === 'numberBetween' || operator === 'numberNotBetween'
  const needsParameterInput = operator !== 'undefined' && operator !== 'notUndefined'

  return (
    <div className="flex-col-2 gap-2">
      <Select
        value={operator}
        onValueChange={(newOperator) => {
          onFilterValueChange({
            operator: newOperator as TableNumberFilter,
            parameter: needsParameterInput ? parameter : {},
          })
        }}
        buttonProps={{ className: 'min-w-64' }}
      >
        {availableOperators.map((op) => (
          <SelectOption key={op} value={op} iconAppearance="right">
            <OperatorLabel operator={op} />
          </SelectOption>
        ))}
      </Select>
      <span className="typography-label-lg font-semibold">{translation('parameter')}</span>
      <Visibility isVisible={needsRangeInput}>
        <div className="flex-col-2 gap-2">
          <FormFieldLayout label={translation('min')}>
            {({ ariaAttributes, interactionStates, id }) => (
              <Input
                {...ariaAttributes}
                {...interactionStates}
                id={id}
                value={parameter.min?.toString() ?? ''}
                type="number"
                placeholder={translation('value')}
                onValueChange={text => {
                  const num = Number(text)
                  onFilterValueChange({
                    operator,
                    parameter: { ...parameter, min: isNaN(num) ? undefined : num },
                  })
                }}
                className="input-indicator-hidden min-w-64"
              />
            )}
          </FormFieldLayout>
          <FormFieldLayout label={translation('max')}>
            {({ ariaAttributes, interactionStates, id }) => (
              <Input
                {...ariaAttributes}
                {...interactionStates}
                id={id}
                value={parameter.max?.toString() ?? ''}
                type="number"
                placeholder={translation('value')}
                onValueChange={text => {
                  const num = Number(text)
                  onFilterValueChange({
                    operator,
                    parameter: { ...parameter, max: isNaN(num) ? undefined : num },
                  })
                }}
                className="input-indicator-hidden min-w-64"
              />
            )}
          </FormFieldLayout>
        </div>
      </Visibility>
      <Visibility isVisible={!needsRangeInput && needsParameterInput}>
        <Input
          value={parameter.compareValue?.toString() ?? ''}
          type="number"
          placeholder={translation('value')}
          onValueChange={text => {
            const num = Number(text)
            onFilterValueChange({
              operator,
              parameter: { compareValue: isNaN(num) ? undefined : num },
            })
          }}
          className="min-w-64"
        />
      </Visibility>
      <Visibility isVisible={!needsParameterInput}>
        <span className="text-sm text-description">
          {translation('noParameterRequired')}
        </span>
      </Visibility>
    </div>
  )
}

export type DateFilterProps = TableFilterBaseProps<DateFilterValue>

export const DateFilter = ({ filterValue, onFilterValueChange }: DateFilterProps) => {
  const translation = useHightideTranslation()
  const operator = filterValue?.operator ?? 'dateBetween'
  const parameter = filterValue?.parameter ?? {}
  const [temporaryMinDateValue, setTemporaryMinDateValue] = useState<Date | null>(null)
  const [temporaryMaxDateValue, setTemporaryMaxDateValue] = useState<Date | null>(null)

  const availableOperators = useMemo(() => [
    ...TableFilterOperator.date,
    ...TableFilterOperator.generic,
  ], [])

  const needsRangeInput = operator === 'dateBetween' || operator === 'dateNotBetween'
  const needsParameterInput = operator !== 'undefined' && operator !== 'notUndefined'

  return (
    <div className="flex-col-2 gap-2">
      <Select
        value={operator}
        onValueChange={(newOperator) => {
          onFilterValueChange({
            operator: newOperator as TableDateFilter,
            parameter: needsParameterInput ? parameter : {},
          })
        }}
        buttonProps={{ className: 'min-w-64' }}
      >
        {availableOperators.map((op) => (
          <SelectOption key={op} value={op} iconAppearance="right">
            <OperatorLabel operator={op} />
          </SelectOption>
        ))}
      </Select>
      <span className="typography-label-lg font-semibold">{translation('parameter')}</span>
      <Visibility isVisible={needsRangeInput}>
        <div className="flex-col-2 gap-2">
          <DateTimeInput
            value={temporaryMinDateValue ?? parameter.min ?? null}
            placeholder={translation('startDate')}
            onValueChange={value => setTemporaryMinDateValue(value)}
            onEditComplete={value => {
              if (value && parameter.max && value > parameter.max) {
                if (!parameter.min) {
                  onFilterValueChange({
                    operator,
                    parameter: { min: parameter.max, max: value },
                  })
                } else {
                  const diff = parameter.max.getTime() - parameter.min.getTime()
                  onFilterValueChange({
                    operator,
                    parameter: { min: value, max: new Date(value.getTime() + diff) },
                  })
                }
              } else {
                onFilterValueChange({
                  operator,
                  parameter: { ...parameter, min: value },
                })
              }
              setTemporaryMinDateValue(null)
            }}
            allowRemove={true}
            outsideClickCloses={false}
            className="min-w-64"
          />
          <DateTimeInput
            value={temporaryMaxDateValue ?? parameter.max ?? null}
            placeholder={translation('endDate')}
            onValueChange={value => setTemporaryMaxDateValue(value)}
            onEditComplete={value => {
              if (value && parameter.min && value < parameter.min) {
                if (!parameter.max) {
                  onFilterValueChange({
                    operator,
                    parameter: { min: value, max: parameter.min },
                  })
                } else {
                  const diff = parameter.max.getTime() - parameter.min.getTime()
                  onFilterValueChange({
                    operator,
                    parameter: { min: new Date(value.getTime() - diff), max: value },
                  })
                }
              } else {
                onFilterValueChange({
                  operator,
                  parameter: { ...parameter, max: value },
                })
              }
            }}
            allowRemove={true}
            outsideClickCloses={false}
            className="min-w-64"
          />
        </div>
      </Visibility>
      <Visibility isVisible={!needsRangeInput && needsParameterInput}>
        <DateTimeInput
          value={parameter.compareDate ?? null}
          placeholder={translation('date')}
          onValueChange={compareDate => {
            onFilterValueChange({
              operator,
              parameter: { compareDate },
            })
          }}
          allowRemove={true}
          outsideClickCloses={false}
          className="min-w-64"
        />
      </Visibility>
      <Visibility isVisible={!needsParameterInput}>
        <span className="text-sm text-description">
          {translation('noParameterRequired')}
        </span>
      </Visibility>
    </div>
  )
}

export type DatetimeFilterProps = TableFilterBaseProps<DatetimeFilterValue>

export const DatetimeFilter = ({ filterValue, onFilterValueChange }: DatetimeFilterProps) => {
  const translation = useHightideTranslation()
  const operator = filterValue?.operator ?? 'dateTimeBetween'
  const parameter = filterValue?.parameter ?? {}
  const [temporaryMinDateValue, setTemporaryMinDateValue] = useState<Date | null>(null)
  const [temporaryMaxDateValue, setTemporaryMaxDateValue] = useState<Date | null>(null)

  const availableOperators = useMemo(() => [
    ...TableFilterOperator.dateTime,
    ...TableFilterOperator.generic,
  ], [])

  const needsRangeInput = operator === 'dateTimeBetween' || operator === 'dateTimeNotBetween'
  const needsParameterInput = operator !== 'undefined' && operator !== 'notUndefined'

  return (
    <div className="flex-col-2 gap-2">
      <Select
        value={operator}
        onValueChange={(newOperator) => {
          onFilterValueChange({
            operator: newOperator as TableDatetimeFilter,
            parameter: needsParameterInput ? parameter : {},
          })
        }}
        buttonProps={{ className: 'min-w-64' }}
      >
        {availableOperators.map((op) => (
          <SelectOption key={op} value={op} iconAppearance="right">
            <OperatorLabel operator={op} />
          </SelectOption>
        ))}
      </Select>
      <span className="typography-label-lg font-semibold">{translation('parameter')}</span>
      <Visibility isVisible={needsRangeInput}>
        <div className="flex-col-2 gap-2">
          <DateTimeInput
            mode="dateTime"
            value={temporaryMinDateValue ?? parameter.min ?? null}
            placeholder={translation('startDate')}
            onValueChange={value => setTemporaryMinDateValue(value)}
            onEditComplete={value => {
              if (value && parameter.max && value > parameter.max) {
                if (!parameter.min) {
                  onFilterValueChange({
                    operator,
                    parameter: { min: parameter.max, max: value },
                  })
                } else {
                  const diff = parameter.max.getTime() - parameter.min.getTime()
                  onFilterValueChange({
                    operator,
                    parameter: { min: value, max: new Date(value.getTime() + diff) },
                  })
                }
              } else {
                onFilterValueChange({
                  operator,
                  parameter: { ...parameter, min: value },
                })
              }
              setTemporaryMinDateValue(null)
            }}
            allowRemove={true}
            outsideClickCloses={false}
            className="min-w-64"
          />
          <DateTimeInput
            mode="dateTime"
            value={temporaryMaxDateValue ?? parameter.max ?? null}
            placeholder={translation('endDate')}
            onValueChange={value => setTemporaryMaxDateValue(value)}
            onEditComplete={value => {
              if (value && parameter.min && value < parameter.min) {
                if (!parameter.max) {
                  onFilterValueChange({
                    operator,
                    parameter: { min: value, max: parameter.min },
                  })
                } else {
                  const diff = parameter.max.getTime() - parameter.min.getTime()
                  onFilterValueChange({
                    operator,
                    parameter: { min: new Date(value.getTime() - diff), max: value },
                  })
                }
              } else {
                onFilterValueChange({
                  operator,
                  parameter: { ...parameter, max: value },
                })
              }
            }}
            allowRemove={true}
            outsideClickCloses={false}
            className="min-w-64"
          />
        </div>
      </Visibility>
      <Visibility isVisible={!needsRangeInput && needsParameterInput}>
        <DateTimeInput
          value={parameter.compareDatetime ?? null}
          placeholder={translation('date')}
          onValueChange={compareDatetime => {
            onFilterValueChange({
              operator,
              parameter: { compareDatetime },
            })
          }}
          allowRemove={true}
          outsideClickCloses={false}
          className="min-w-64"
        />
      </Visibility>
      <Visibility isVisible={!needsParameterInput}>
        <span className="text-sm text-description">
          {translation('noParameterRequired')}
        </span>
      </Visibility>
    </div>
  )
}
export type BooleanFilterProps = TableFilterBaseProps<BooleanFilterValue>

export const BooleanFilter = ({ filterValue, onFilterValueChange }: BooleanFilterProps) => {
  const operator = filterValue?.operator ?? 'booleanIsTrue'

  const availableOperators = useMemo(() => [
    ...TableFilterOperator.boolean,
    ...TableFilterOperator.generic,
  ], [])


  return (
    <div className="flex-col-2 gap-2">
      <Select
        value={operator}
        onValueChange={(newOperator) => {
          onFilterValueChange({
            operator: newOperator as TableBooleanFilter,
            parameter: {},
          })
        }}
        buttonProps={{ className: 'min-w-64' }}
      >
        {availableOperators.map((op) => (
          <SelectOption key={op} value={op} iconAppearance="right">
            <OperatorLabel operator={op} />
          </SelectOption>
        ))}
      </Select>
    </div>
  )
}

export type TagsFilterProps = TableFilterBaseProps<TagsFilterValue>

export const TagsFilter = ({ columnId, filterValue, onFilterValueChange }: TagsFilterProps) => {
  const translation = useHightideTranslation()
  const { table: table } = useTableDataContext()
  const operator = filterValue?.operator ?? 'tagsContains'
  const parameter = filterValue?.parameter ?? {}

  const availableOperators = useMemo(() => [
    ...TableFilterOperator.tags,
    ...TableFilterOperator.generic,
  ], [])

  const availableTags = useMemo(() => {
    const column = table.getColumn(columnId)
    if (!column) return []
    return column.columnDef.meta?.filterData?.tags ?? []
  }, [columnId, table])

  if (availableTags.length === 0) {
    return null
  }

  const needsParameterInput = operator !== 'undefined' && operator !== 'notUndefined'

  return (
    <div className="flex-col-2 gap-2">
      <Select
        value={operator}
        onValueChange={(newOperator) => {
          onFilterValueChange({
            operator: newOperator as TableTagsFilter,
            parameter: needsParameterInput ? parameter : {},
          })
        }}
        buttonProps={{ className: 'min-w-64' }}
      >
        {availableOperators.map((op) => (
          <SelectOption key={op} value={op} iconAppearance="right">
            <OperatorLabel operator={op} />
          </SelectOption>
        ))}
      </Select>
      <span className="typography-label-lg font-semibold">{translation('parameter')}</span>
      <Visibility isVisible={needsParameterInput}>
        <MultiSelect
          value={Array.isArray(parameter.searchTags) ? parameter.searchTags.map(tag => String(tag)) : []}
          onValueChange={(selectedTags: string[]) => {
            onFilterValueChange({
              operator,
              parameter: { searchTags: selectedTags.length > 0 ? selectedTags : undefined },
            })
          }}
          buttonProps={{ className: 'min-w-64' }}
        >
          {availableTags.map(({ tag, label }) => (
            <MultiSelectOption key={tag} value={tag}>
              {label}
            </MultiSelectOption>
          ))}
        </MultiSelect>
      </Visibility>
      <Visibility isVisible={!needsParameterInput}>
        <span className="text-sm text-description">
          {translation('noParameterRequired')}
        </span>
      </Visibility>
    </div>
  )
}

export type TagsSingleFilterProps = TableFilterBaseProps<TagsSingleFilterValue>
export const TagsSingleFilter = ({ columnId, filterValue, onFilterValueChange }: TagsSingleFilterProps) => {
  const translation = useHightideTranslation()
  const { table: table } = useTableDataContext()
  const operator = filterValue?.operator ?? 'tagsSingleContains'
  const parameter = filterValue?.parameter ?? {}

  const availableOperators = useMemo(() => [
    ...TableFilterOperator.tagsSingle,
    ...TableFilterOperator.generic,
  ], [])

  const availableTags = useMemo(() => {
    const column = table.getColumn(columnId)
    if (!column) return []
    return column.columnDef.meta?.filterData?.tags ?? []
  }, [columnId, table])

  if (availableTags.length === 0) {
    return null
  }

  const needsParameterInput = operator !== 'undefined' && operator !== 'notUndefined'
  const needsMultiSelect = operator === 'tagsSingleContains' || operator === 'tagsSingleNotContains'

  return (
    <div className="flex-col-2 gap-2">
      <Select
        value={operator}
        onValueChange={(newOperator) => {
          onFilterValueChange({
            operator: newOperator as TableTagsSingleFilter,
            parameter: needsParameterInput ? parameter : {},
          })
        }}
        buttonProps={{ className: 'min-w-64' }}
      >
        {availableOperators.map((op) => (
          <SelectOption key={op} value={op} iconAppearance="right">
            <OperatorLabel operator={op} />
          </SelectOption>
        ))}
      </Select>
      <span className="typography-label-lg font-semibold">{translation('parameter')}</span>
      <Visibility isVisible={needsParameterInput && needsMultiSelect}>
        <MultiSelect
          value={Array.isArray(parameter.searchTagsContains) ? parameter.searchTagsContains.map(tag => String(tag)) : []}
          onValueChange={(selectedTags: string[]) => {
            onFilterValueChange({
              operator,
              parameter: { searchTagsContains: selectedTags.length > 0 ? selectedTags : undefined },
            })
          }}
          buttonProps={{ className: 'min-w-64' }}
        >
          {availableTags.map(({ tag, label }) => (
            <MultiSelectOption key={tag} value={tag}>
              {label}
            </MultiSelectOption>
          ))}
        </MultiSelect>
      </Visibility>
      <Visibility isVisible={needsParameterInput && !needsMultiSelect}>
        <Select
          value={parameter.searchTag ? String(parameter.searchTag) : undefined}
          onValueChange={(selectedTag: string) => {
            onFilterValueChange({
              operator,
              parameter: { searchTag: selectedTag ? String(selectedTag) : undefined },
            })
          }}
          buttonProps={{ className: 'min-w-64' }}
        >
          {availableTags.map(({ tag, label }) => (
            <SelectOption key={tag} value={tag}>
              {label}
            </SelectOption>
          ))}
        </Select>
      </Visibility>
      <Visibility isVisible={!needsParameterInput}>
        <span className="text-sm text-description">
          {translation('noParameterRequired')}
        </span>
      </Visibility>
    </div>
  )
}

export type GenericFilterProps = TableFilterBaseProps<GenericFilterValue>

export const GenericFilter = ({ filterValue, onFilterValueChange }: GenericFilterProps) => {
  const operator = filterValue?.operator ?? 'notUndefined'

  const availableOperators = useMemo(() => [
    ...TableFilterOperator.generic,
  ], [])

  return (
    <div className="flex-col-2 gap-2">
      <Select
        value={operator}
        onValueChange={(newOperator) => {
          onFilterValueChange({
            operator: newOperator as TableGenericFilter,
            parameter: {},
          })
        }}
        buttonProps={{ className: 'min-w-64' }}
      >
        {availableOperators.map((op) => (
          <SelectOption key={op} value={op} iconAppearance="right">
            <OperatorLabel operator={op} />
          </SelectOption>
        ))}
      </Select>
    </div>
  )
}

export interface TableFilterContentProps extends TableFilterBaseProps<TableFilterValue> {
  filterType: TableFilterCategory,
}

export const TableFilterContent = ({ filterType, ...props }: TableFilterContentProps) => {
  switch (filterType) {
  case 'text':
    return <TextFilter {...props as TableFilterBaseProps<TextFilterValue>} />
  case 'number':
    return <NumberFilter {...props as TableFilterBaseProps<NumberFilterValue>} />
  case 'date':
    return <DateFilter {...props as TableFilterBaseProps<DateFilterValue>} />
  case 'dateTime':
    return <DatetimeFilter {...props as TableFilterBaseProps<DatetimeFilterValue>} />
  case 'boolean':
    return <BooleanFilter {...props as TableFilterBaseProps<BooleanFilterValue>} />
  case 'tags':
    return <TagsFilter {...props as TableFilterBaseProps<TagsFilterValue>} />
  case 'tagsSingle':
    return <TagsSingleFilter {...props as TableFilterBaseProps<TagsSingleFilterValue>} />
  case 'generic':
    return <GenericFilter {...props as TableFilterBaseProps<GenericFilterValue>} />
  default:
    return null
  }
}
