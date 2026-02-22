import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Visibility } from '@/src/components/layout/Visibility'
import { IconButton } from '@/src/components/user-interaction/IconButton'
import { TrashIcon, XIcon } from 'lucide-react'
import { PopUp, type PopUpProps } from '@/src/components/layout/popup/PopUp'
import type { FilterValue } from './filter-function'
import type { FilterOperator } from './FilterOperator'
import { FilterOperatorUtils } from './FilterOperator'
import type { ReactNode } from 'react'
import { forwardRef, useId, useMemo, useState } from 'react'
import { Select } from '../Select/Select'
import { SelectOption } from '../Select/SelectOption'
import { Input } from '../input/Input'
import { Checkbox } from '../Checkbox'
import { DateTimeInput } from '../input/DateTimeInput'
import { MultiSelect } from '../MultiSelect/MultiSelect'
import { MultiSelectOption } from '../MultiSelect/MultiSelectOption'
import type { DataType } from './data-types'
import clsx from 'clsx'
import { FilterOperatorLabel } from './FilterOperatorLabel'

export interface FilterPopUpProps extends PopUpProps {
  name?: ReactNode,
  value?: FilterValue,
  onValueChange: (value: FilterValue) => void,
  onRemove: () => void,
}

export interface FilterPopUpBaseProps extends PopUpProps {
  /**
   * The name of the object/column the filter is applied to
   */
  name?: ReactNode,
  operator: FilterOperator,
  onOperatorChange: (operator: FilterOperator) => void,
  onRemove: () => void,
  allowedOperators: FilterOperator[],
  hasValue: boolean,
  noParameterRequired?: boolean,
}

export const FilterBasePopUp = forwardRef<HTMLDivElement, FilterPopUpBaseProps>(function FilterBasePopUp ({
  children,
  name,
  operator,
  onOperatorChange,
  onRemove,
  allowedOperators,
  hasValue,
  noParameterRequired = false,
  ...props
}: FilterPopUpBaseProps, ref) {
  const translation = useHightideTranslation()

  return (
    <PopUp ref={ref} {...props} className={clsx('flex-col-3 p-3 relative min-w-64', props.className)}>
      <div className="flex-row-4 justify-between w-full">
        <div className="flex-row-0.5 items-center">
          <span className="typography-label-sm text-description">{name ?? translation('filter')}</span>
          <Select
            value={operator}
            onValueChange={(newOperator) => onOperatorChange(newOperator as FilterOperator)}
            buttonProps={{
              'data-name': 'filter-operator-select',
              'className': 'w-fit coloring-text-hover neutral flex-row-1 items-center h-element-sm px-2 py-1 rounded-md hover:cursor-pointer font-bold',
              'selectedDisplay': (op: FilterOperator) => translation(FilterOperatorUtils.getInfo(op).translationKey)
            }}
            iconAppearance="right"
          >
            {allowedOperators.map((op) => (
              <SelectOption key={op} value={op} label={translation(FilterOperatorUtils.getInfo(op).translationKey)}>
                <FilterOperatorLabel operator={op} />
              </SelectOption>
            ))}
          </Select>
        </div>
        <Visibility isVisible={hasValue}>
          <IconButton
            tooltip={translation('removeFilter')}
            onClick={onRemove}
            color="negative"
            coloringStyle="text"
            size="sm"
          >
            <TrashIcon className="size-4" />
          </IconButton>
        </Visibility>
        <Visibility isVisible={!hasValue}>
          <IconButton
            tooltip={translation('close')}
            onClick={props.onClose}
            color="neutral"
            coloringStyle="text"
            size="sm"
          >
            <XIcon className="size-4" />
          </IconButton>
        </Visibility>
      </div>
      {children}
      <Visibility isVisible={noParameterRequired}>
        <div className="flex-row-0 items-center text-sm text-description h-element-sm">
          {translation('noParameterRequired')}
        </div>
      </Visibility>
    </PopUp>
  )
})


export const TextFilterPopUp = forwardRef<HTMLDivElement, FilterPopUpProps>(function TextFilterPopUp ({
  name, value, onValueChange, onRemove, ...props
}: FilterPopUpProps, ref) {
  const translation = useHightideTranslation()
  const id = useId()
  const ids = {
    search: `text-filter-search-${id}`,
    caseSensitive: `text-filter-case-sensitive-${id}`,
  }
  const operator = useMemo(() => {
    const suggestion = value?.operator ?? 'contains'
    if(!FilterOperatorUtils.typeCheck.text(suggestion)) {
      return 'contains'
    }
    return suggestion
  }, [value])
  const parameter = value?.parameter ?? {}

  const needsParameterInput = operator !== 'isUndefined' && operator !== 'isNotUndefined'
  return (
    <FilterBasePopUp ref={ref}
      {...props}
      name={name}
      operator={operator}
      onOperatorChange={(newOperator) => onValueChange({ dataType: 'text', parameter, operator: newOperator })}
      onRemove={onRemove}
      allowedOperators={FilterOperatorUtils.operatorsByCategory.text}
      hasValue={!!value}
      noParameterRequired={!needsParameterInput}
    >
      <Visibility isVisible={needsParameterInput}>
        <div className="flex-col-1">
          <label htmlFor={ids.search} className="typography-label-md">{translation('search')}</label>
          <Input
            id={ids.search}
            value={parameter.searchText ?? ''}
            placeholder={translation('value')}
            onValueChange={searchText => {
              onValueChange({
                dataType: 'text',
                operator,
                parameter: { ...parameter, searchText },
              })
            }}
            className="min-w-64"
          />
        </div>
        <div className="flex-row-2 items-center mt-1">
          <Checkbox
            id={ids.caseSensitive}
            value={parameter.isCaseSensitive ?? false}
            onValueChange={isCaseSensitive => {
              onValueChange({
                dataType: 'text',
                operator,
                parameter: { ...parameter, isCaseSensitive },
              })
            }}
          />
          <label htmlFor={ids.caseSensitive}>{translation('caseSensitive')}</label>
        </div>
      </Visibility>
    </FilterBasePopUp>
  )
})

export const NumberFilterPopUp = forwardRef<HTMLDivElement, FilterPopUpProps>(function NumberFilterPopUp ({
  name, value, onValueChange, onRemove, ...props
}: FilterPopUpProps, ref) {
  const translation = useHightideTranslation()
  const id = useId()
  const ids = {
    min: `number-filter-min-${id}`,
    max: `number-filter-max-${id}`,
    compareValue: `number-filter-compare-value-${id}`,
  }
  const operator = useMemo(() => {
    const suggestion = value?.operator ?? 'between'
    if (!FilterOperatorUtils.typeCheck.number(suggestion)) {
      return 'between'
    }
    return suggestion
  }, [value])
  const parameter = value?.parameter ?? {}

  const needsRangeInput = operator === 'between' || operator === 'notBetween'
  const needsParameterInput = operator !== 'isUndefined' && operator !== 'isNotUndefined'

  return (
    <FilterBasePopUp ref={ref}
      {...props}
      name={name}
      operator={operator}
      onOperatorChange={(newOperator) => onValueChange({ dataType: 'number', parameter, operator: newOperator })}
      onRemove={onRemove}
      allowedOperators={FilterOperatorUtils.operatorsByCategory.number}
      hasValue={!!value}
      noParameterRequired={!needsParameterInput}
    >
      <Visibility isVisible={needsRangeInput}>
        <div className="flex-col-1">
          <label htmlFor={ids.min} className="typography-label-md">{translation('min')}</label>
          <Input
            id={ids.min}
            value={parameter.minNumber?.toString() ?? ''}
            type="number"
            placeholder="0"
            onValueChange={text => {
              const num = Number(text)
              onValueChange({
                dataType: 'number',
                operator,
                parameter: { ...parameter, minNumber: isNaN(num) ? undefined : num },
              })
            }}
            className="min-w-64"
          />
        </div>
        <div className="flex-col-1">
          <label htmlFor={ids.max} className="typography-label-md">{translation('max')}</label>
          <Input
            id={ids.max}
            value={parameter.maxNumber?.toString() ?? ''}
            type="number"
            placeholder="1"
            onValueChange={text => {
              const num = Number(text)
              onValueChange({
                dataType: 'number',
                operator,
                parameter: { ...parameter, maxNumber: isNaN(num) ? undefined : num },
              })
            }}
            className="min-w-64"
          />
        </div>
      </Visibility>
      <Visibility isVisible={!needsRangeInput && needsParameterInput}>
        <Input
          value={parameter.compareValue?.toString() ?? ''}
          type="number"
          placeholder="0"
          onValueChange={text => {
            const num = Number(text)
            onValueChange({
              dataType: 'number',
              operator,
              parameter: { ...parameter, compareValue: isNaN(num) ? undefined : num },
            })
          }}
          className="min-w-64"
        />
      </Visibility>
    </FilterBasePopUp>
  )
})

export const DateFilterPopUp = forwardRef<HTMLDivElement, FilterPopUpProps>(function DateFilterPopUp ({
  name, value, onValueChange, onRemove, ...props
}: FilterPopUpProps, ref) {
  const translation = useHightideTranslation()
  const id = useId()
  const ids = {
    startDate: `date-filter-start-date-${id}`,
    endDate: `date-filter-end-date-${id}`,
    compareDate: `date-filter-compare-date-${id}`,
  }
  const operator = useMemo(() => {
    const suggestion = value?.operator ?? 'between'
    if (!FilterOperatorUtils.typeCheck.date(suggestion)) {
      return 'between'
    }
    return suggestion
  }, [value])
  const parameter = value?.parameter ?? {}
  const [temporaryMinDateValue, setTemporaryMinDateValue] = useState<Date | null>(null)
  const [temporaryMaxDateValue, setTemporaryMaxDateValue] = useState<Date | null>(null)

  const needsRangeInput = operator === 'between' || operator === 'notBetween'
  const needsParameterInput = operator !== 'isUndefined' && operator !== 'isNotUndefined'

  return (
    <FilterBasePopUp ref={ref}
      {...props}
      name={name}
      operator={operator}
      onOperatorChange={(newOperator) => onValueChange({ dataType: 'date', parameter, operator: newOperator })}
      onRemove={onRemove}
      allowedOperators={FilterOperatorUtils.operatorsByCategory.date}
      hasValue={!!value}
      noParameterRequired={!needsParameterInput}
    >
      <Visibility isVisible={needsRangeInput}>
        <div className="flex-col-1">
          <label htmlFor={ids.startDate} className="typography-label-md">{translation('startDate')}</label>
          <DateTimeInput
            id={ids.startDate}
            value={temporaryMinDateValue ?? parameter.minDate ?? null}
            onValueChange={setTemporaryMinDateValue}
            onEditComplete={dateValue => {
              if (dateValue && parameter.maxDate && dateValue > parameter.maxDate) {
                if (!parameter.minDate) {
                  onValueChange({
                    dataType: 'date',
                    operator,
                    parameter: { ...parameter, minDate: parameter.maxDate, maxDate: dateValue },
                  })
                } else {
                  const diff = parameter.maxDate.getTime() - parameter.minDate.getTime()
                  onValueChange({
                    dataType: 'date',
                    operator,
                    parameter: { ...parameter, minDate: dateValue, maxDate: new Date(dateValue.getTime() + diff) },
                  })
                }
              } else {
                onValueChange({
                  dataType: 'date',
                  operator,
                  parameter: { ...parameter, minDate: dateValue },
                })
              }
              setTemporaryMinDateValue(null)
            }}
            allowRemove={true}
            outsideClickCloses={false}
            className="min-w-64"
          />
        </div>
        <div className="flex-col-1">
          <label htmlFor={ids.endDate} className="typography-label-md">{translation('endDate')}</label>
          <DateTimeInput
            id={ids.endDate}
            value={temporaryMaxDateValue ?? parameter.maxDate ?? null}
            onValueChange={setTemporaryMaxDateValue}
            onEditComplete={dateValue => {
              if (dateValue && parameter.minDate && dateValue < parameter.minDate) {
                if (!parameter.maxDate) {
                  onValueChange({
                    dataType: 'date',
                    operator,
                    parameter: { ...parameter, minDate: dateValue, maxDate: parameter.minDate },
                  })
                } else {
                  const diff = parameter.maxDate.getTime() - parameter.minDate.getTime()
                  onValueChange({
                    dataType: 'date',
                    operator,
                    parameter: { ...parameter, minDate: new Date(dateValue.getTime() - diff), maxDate: dateValue },
                  })
                }
              } else {
                onValueChange({
                  dataType: 'date',
                  operator,
                  parameter: { ...parameter, maxDate: dateValue },
                })
              }
              setTemporaryMaxDateValue(null)
            }}
            allowRemove={true}
            outsideClickCloses={false}
            className="min-w-64"
          />
        </div>
      </Visibility>
      <Visibility isVisible={!needsRangeInput && needsParameterInput}>
        <label htmlFor={ids.compareDate} className="typography-label-md">{translation('date')}</label>
        <DateTimeInput
          id={ids.compareDate}
          value={parameter.compareDate ?? null}
          onValueChange={compareDate => {
            onValueChange({
              ...value,
              parameter: { ...parameter, compareDate },
            })
          }}
          allowRemove={true}
          outsideClickCloses={false}
          className="min-w-64"
        />
      </Visibility>
      <Visibility isVisible={!needsParameterInput}>
        <span className="text-sm text-description h-10">
          {translation('noParameterRequired')}
        </span>
      </Visibility>
    </FilterBasePopUp>
  )
})

export const DatetimeFilterPopUp = forwardRef<HTMLDivElement, FilterPopUpProps>(function DatetimeFilterPopUp ({
  name, value, onValueChange, onRemove, ...props
}: FilterPopUpProps, ref) {
  const translation = useHightideTranslation()
  const id = useId()
  const ids = {
    startDate: `datetime-filter-start-date-${id}`,
    endDate: `datetime-filter-end-date-${id}`,
    compareDate: `datetime-filter-compare-date-${id}`,
  }
  const operator = useMemo(() => {
    const suggestion = value?.operator ?? 'between'
    if (!FilterOperatorUtils.typeCheck.datetime(suggestion)) {
      return 'between'
    }
    return suggestion
  }, [value])
  const parameter = value?.parameter ?? {}
  const [temporaryMinDateValue, setTemporaryMinDateValue] = useState<Date | null>(null)
  const [temporaryMaxDateValue, setTemporaryMaxDateValue] = useState<Date | null>(null)

  const needsRangeInput = operator === 'between' || operator === 'notBetween'
  const needsParameterInput = operator !== 'isUndefined' && operator !== 'isNotUndefined'

  return (
    <FilterBasePopUp ref={ref}
      {...props}
      name={name}
      operator={operator}
      onOperatorChange={(newOperator) => onValueChange({ dataType: 'dateTime', parameter, operator: newOperator })}
      onRemove={onRemove}
      allowedOperators={FilterOperatorUtils.operatorsByCategory.dateTime}
      hasValue={!!value}
    >
      <span className="typography-label-lg font-semibold">{translation('parameter')}</span>
      <Visibility isVisible={needsRangeInput}>
        <div className="flex-col-2 gap-2">
          <label htmlFor={ids.startDate} className="typography-label-md">{translation('startDate')}</label>
          <DateTimeInput
            id={ids.startDate}
            mode="dateTime"
            value={temporaryMinDateValue ?? parameter.minDate ?? null}
            onValueChange={setTemporaryMinDateValue}
            onEditComplete={dateValue => {
              if (dateValue && parameter.maxDate && dateValue > parameter.maxDate) {
                if (!parameter.minDate) {
                  onValueChange({
                    dataType: 'dateTime',
                    operator,
                    parameter: { ...parameter, minDate: parameter.maxDate, maxDate: dateValue },
                  })
                } else {
                  const diff = parameter.maxDate.getTime() - parameter.minDate.getTime()
                  onValueChange({
                    dataType: 'dateTime',
                    operator,
                    parameter: { ...parameter, minDate: dateValue, maxDate: new Date(dateValue.getTime() + diff) },
                  })
                }
              } else {
                onValueChange({
                  dataType: 'dateTime',
                  operator,
                  parameter: { ...parameter, minDate: dateValue },
                })
              }
              setTemporaryMinDateValue(null)
            }}
            allowRemove={true}
            outsideClickCloses={false}
            className="min-w-64"
          />
          <label htmlFor={ids.endDate} className="typography-label-md">{translation('endDate')}</label>
          <DateTimeInput
            id={ids.endDate}
            mode="dateTime"
            value={temporaryMaxDateValue ?? parameter.maxDate ?? null}
            onValueChange={setTemporaryMaxDateValue}
            onEditComplete={dateValue => {
              if (dateValue && parameter.minDate && dateValue < parameter.minDate) {
                if (!parameter.maxDate) {
                  onValueChange({
                    dataType: 'dateTime',
                    operator,
                    parameter: { ...parameter, minDate: dateValue, maxDate: parameter.minDate },
                  })
                } else {
                  const diff = parameter.maxDate.getTime() - parameter.minDate.getTime()
                  onValueChange({
                    dataType: 'dateTime',
                    operator,
                    parameter: { ...parameter, minDate: new Date(dateValue.getTime() - diff), maxDate: dateValue },
                  })
                }
              } else {
                onValueChange({
                  dataType: 'dateTime',
                  operator,
                  parameter: { ...parameter, maxDate: dateValue },
                })
              }
              setTemporaryMaxDateValue(null)
            }}
            allowRemove={true}
            outsideClickCloses={false}
            className="min-w-64"
          />
        </div>
      </Visibility>
      <Visibility isVisible={!needsRangeInput && needsParameterInput}>
        <label htmlFor={ids.compareDate} className="typography-label-md">{translation('date')}</label>
        <DateTimeInput
          id={ids.compareDate}
          mode="dateTime"
          value={parameter.compareDate ?? null}
          onValueChange={compareDate => {
            onValueChange({
              dataType: 'dateTime',
              operator,
              parameter: { ...parameter, compareDate },
            })
          }}
          allowRemove={true}
          outsideClickCloses={false}
          className="min-w-64"
        />
      </Visibility>
      <Visibility isVisible={!needsParameterInput}>
        <span className="text-sm text-description h-10">
          {translation('noParameterRequired')}
        </span>
      </Visibility>
    </FilterBasePopUp>
  )
})

export const BooleanFilterPopUp = forwardRef<HTMLDivElement, FilterPopUpProps>(function BooleanFilterPopUp ({
  name, value, onValueChange, onRemove, ...props
}: FilterPopUpProps, ref) {
  const operator = useMemo(() => {
    const suggestion = value?.operator ?? 'isTrue'
    if (!FilterOperatorUtils.typeCheck.boolean(suggestion)) {
      return 'isTrue'
    }
    return suggestion
  }, [value])
  const parameter = value?.parameter ?? {}

  return (
    <FilterBasePopUp ref={ref}
      {...props}
      name={name}
      operator={operator}
      onOperatorChange={(newOperator) => onValueChange({ dataType: 'boolean', parameter, operator: newOperator })}
      onRemove={onRemove}
      allowedOperators={FilterOperatorUtils.operatorsByCategory.boolean}
      hasValue={!!value}
    />
  )
})

export interface TagsFilterPopUpProps extends FilterPopUpProps {
  tags: ReadonlyArray<{ tag: string, label: string, display?: ReactNode }>,
}

export const TagsFilterPopUp = forwardRef<HTMLDivElement, TagsFilterPopUpProps>(function TagsFilterPopUp ({
  name, value, onValueChange, onRemove, tags: availableTags, ...props
}: TagsFilterPopUpProps, ref) {
  const translation = useHightideTranslation()
  const operator = useMemo(() => {
    const suggestion = value?.operator ?? 'contains'
    if (!FilterOperatorUtils.typeCheck.tags(suggestion)) {
      return 'contains'
    }
    return suggestion
  }, [value])
  const parameter = value?.parameter ?? {}
  const selectedTags = (Array.isArray(parameter.multiOptionSearch) ? parameter.multiOptionSearch : []) as string[]

  const needsParameterInput = operator !== 'isUndefined' && operator !== 'isNotUndefined'

  if (availableTags.length === 0) {
    return null
  }

  return (
    <FilterBasePopUp ref={ref}
      {...props}
      name={name}
      operator={operator}
      onOperatorChange={(newOperator) => onValueChange({ dataType: 'multiTags', parameter, operator: newOperator })}
      onRemove={onRemove}
      allowedOperators={FilterOperatorUtils.operatorsByCategory.multiTags}
      hasValue={!!value}
    >
      <span className="typography-label-lg font-semibold">{translation('parameter')}</span>
      <Visibility isVisible={needsParameterInput}>
        <MultiSelect
          value={selectedTags}
          onValueChange={(selected) => {
            onValueChange({
              dataType: 'multiTags',
              operator,
              parameter: { ...parameter, multiOptionSearch: selected.length > 0 ? selected : undefined },
            })
          }}
          buttonProps={{ className: 'min-w-64' }}
        >
          {availableTags.map(({ tag, label }) => (
            <MultiSelectOption key={tag} value={tag} label={label}>
              {label}
            </MultiSelectOption>
          ))}
        </MultiSelect>
      </Visibility>
      <Visibility isVisible={!needsParameterInput}>
        <span className="text-sm text-description h-10">
          {translation('noParameterRequired')}
        </span>
      </Visibility>
    </FilterBasePopUp>
  )
})

export interface TagsSingleFilterPopUpProps extends FilterPopUpProps {
  tags: ReadonlyArray<{ tag: string, label: string, display?: ReactNode }>,
}

export const TagsSingleFilterPopUp = forwardRef<HTMLDivElement, TagsSingleFilterPopUpProps>(function TagsSingleFilterPopUp ({
  name, value, onValueChange, onRemove, tags: availableTags, ...props
}: TagsSingleFilterPopUpProps, ref) {
  const translation = useHightideTranslation()
  const operator = useMemo(() => {
    const suggestion = value?.operator ?? 'contains'
    if (!FilterOperatorUtils.typeCheck.tagsSingle(suggestion)) {
      return 'contains'
    }
    return suggestion
  }, [value])
  const parameter = value?.parameter ?? {}
  const selectedTagsMulti = (Array.isArray(parameter.multiOptionSearch) ? parameter.multiOptionSearch : []) as string[]
  const selectedTagSingle = parameter.singleOptionSearch != null ? String(parameter.singleOptionSearch) : undefined

  const needsParameterInput = operator !== 'isUndefined' && operator !== 'isNotUndefined'
  const needsMultiSelect = operator === 'contains' || operator === 'notContains'

  if (availableTags.length === 0) {
    return null
  }

  return (
    <FilterBasePopUp ref={ref}
      {...props}
      name={name}
      operator={operator}
      onOperatorChange={(newOperator) => onValueChange({ dataType: 'singleTag', parameter, operator: newOperator })}
      onRemove={onRemove}
      allowedOperators={FilterOperatorUtils.operatorsByCategory.singleTag}
      hasValue={!!value}
    >
      <span className="typography-label-lg font-semibold">{translation('parameter')}</span>
      <Visibility isVisible={needsParameterInput && needsMultiSelect}>
        <MultiSelect
          value={selectedTagsMulti}
          onValueChange={(selected) => {
            onValueChange({
              dataType: 'singleTag',
              operator,
              parameter: { ...parameter, multiOptionSearch: selected.length > 0 ? selected : undefined },
            })
          }}
          buttonProps={{ className: 'min-w-64' }}
        >
          {availableTags.map(({ tag, label }) => (
            <MultiSelectOption key={tag} value={tag} label={label} />
          ))}
        </MultiSelect>
      </Visibility>
      <Visibility isVisible={needsParameterInput && !needsMultiSelect}>
        <Select
          value={selectedTagSingle}
          onValueChange={(selectedTag) => {
            onValueChange({
              dataType: 'singleTag',
              operator,
              parameter: { ...parameter, singleOptionSearch: selectedTag ?? undefined },
            })
          }}
          buttonProps={{ className: 'min-w-64' }}
        >
          {availableTags.map(({ tag, label }) => (
            <SelectOption key={tag} value={tag} label={label} />
          ))}
        </Select>
      </Visibility>
      <Visibility isVisible={!needsParameterInput}>
        <span className="text-sm text-description h-10">
          {translation('noParameterRequired')}
        </span>
      </Visibility>
    </FilterBasePopUp>
  )
})

export const GenericFilterPopUp = forwardRef<HTMLDivElement, FilterPopUpProps>(function GenericFilterPopUp ({ name, value, onValueChange, ...props }: FilterPopUpProps, ref) {
  const operator = useMemo(() => {
    const suggestion = value?.operator ?? 'isNotUndefined'
    if (!FilterOperatorUtils.typeCheck.unknownType(suggestion)) {
      return 'isNotUndefined'
    }
    return suggestion
  }, [value])

  return (
    <FilterBasePopUp ref={ref}
      {...props}
      name={name}
      operator={operator}
      onOperatorChange={(newOperator) => onValueChange({ ...value, operator: newOperator })}
      onRemove={() => onValueChange({ ...value, operator: undefined })}
      allowedOperators={FilterOperatorUtils.operatorsByCategory.unknownType}
      hasValue={!!value}
    />
  )
})

export interface DataTypeFilterPopUpProps extends FilterPopUpProps {
  dataType: DataType,
  tags: ReadonlyArray<{ tag: string, label: string, display?: ReactNode }>,
}
export const FilterPopUp = forwardRef<HTMLDivElement, DataTypeFilterPopUpProps>(function FilterPopUp ({
  name,
  value,
  onValueChange,
  dataType,
  tags,
  ...props
}: DataTypeFilterPopUpProps, ref) {
  switch (dataType) {
  case 'text':
    return <TextFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} {...props} />
  case 'number':
    return <NumberFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} {...props} />
  case 'date':
    return <DateFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} {...props} />
  case 'dateTime':
    return <DatetimeFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} {...props} />
  case 'boolean':
    return <BooleanFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} {...props} />
  case 'multiTags':
    return <TagsFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} tags={tags} {...props} />
  case 'singleTag':
    return <TagsSingleFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} tags={tags} {...props} />
  case 'unknownType':
    return <GenericFilterPopUp ref={ref} name={name} value={value} onValueChange={onValueChange} {...props} />
  }
})