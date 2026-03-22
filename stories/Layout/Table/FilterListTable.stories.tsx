import type { Meta, StoryObj } from '@storybook/nextjs'
import type { ColumnSort } from '@tanstack/react-table'
import { useId, useMemo, useState } from 'react'
import { faker } from '@faker-js/faker'
import { range } from '@/src/utils/array'
import { Table } from '@/src/components/layout/table/Table'
import { TableColumn } from '@/src/components/layout/table/TableColumn'
import { TableCell } from '@/src/components/layout/table/TableCell'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { FilterList } from '@/src/components/user-interaction/data/FilterList'
import type { IdentifierFilterValue, FilterListItem, FilterListPopUpBuilderProps } from '@/src/components/user-interaction/data/FilterList'
import { FilterFunctions } from '@/src/components/user-interaction/data/filter-function'
import type { DataType } from '@/src/components/user-interaction/data/data-types'
import { FilterOperatorUtils } from '@/src/components/user-interaction/data/FilterOperator'
import { FilterBasePopUp } from '@/src/components/user-interaction/data/FilterPopUp'
import { Input } from '@/src/components/user-interaction/input/Input'
import { Select } from '@/src/components/user-interaction/Select/Select'
import { SelectOption } from '@/src/components/user-interaction/Select/SelectOption'
import { Visibility } from '@/src/components/layout/Visibility'
import { SortingList } from '@/src/components/user-interaction/data/SortingList'
import type { SortingListItem } from '@/src/components/user-interaction/data/SortingList'
import { DateUtils } from '@/src/utils/date'
import { TableColumnSwitcher } from '@/src/components/layout/table/TableColumnSwitcher'

type Row = {
  name: string,
  age: number,
  entryDate: Date,
  hasChildren: boolean,
}

const createRow = (): Row => ({
  name: faker.person.fullName(),
  age: faker.number.int(100),
  entryDate: faker.date.past({ years: 20 }),
  hasChildren: faker.datatype.boolean(),
})

const AgeFilterPopUp = ({ value, onValueChange, onRemove, name, onClose: close, ...props }: FilterListPopUpBuilderProps) => {
  const translation = useHightideTranslation()
  const id = useId()
  const ids = {
    range: `number-filter-range-${id}`,
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

  const ageRange = useMemo(() => range(11).map(i => i * 10), [])

  return (
    <FilterBasePopUp
      onClose={close}
      name={name}
      operatorOverrides={props.operatorOverrides}
      operator={operator}
      onOperatorChange={(newOperator) => onValueChange({ dataType: 'number', parameter, operator: newOperator })}
      onRemove={onRemove}
      allowedOperators={FilterOperatorUtils.operatorsByCategory.number}
      noParameterRequired={!needsParameterInput}
    >
      <Visibility isVisible={needsRangeInput}>
        <div className="flex-col-1">
          <label htmlFor={ids.range} className="typography-label-md">{translation('min')}</label>
          <Select<[number, number]>
            buttonProps={{ id: ids.range }}
            value={parameter.numberMin !== undefined && parameter.numberMax !== undefined ? [parameter.numberMin, parameter.numberMax] : null}
            onValueChange={(newRange) => {
              onValueChange({ ...value, parameter: { ...parameter, numberMin: newRange[0], numberMax: newRange[1] } })
            }}
            compareFunction={(a, b) => {
              if (a === null || b === null) return false
              return a[0] === b[0] && a[1] === b[1]
            }}
          >
            {range(ageRange.length - 1).map(i => (
              <SelectOption key={i} value={[ageRange[i], ageRange[i + 1]]} label={`${ageRange[i]} - ${ageRange[i + 1]}`}>
                {ageRange[i]} - {ageRange[i + 1]}
              </SelectOption>
            ))}
          </Select>
        </div>
      </Visibility>
      <Visibility isVisible={!needsRangeInput && needsParameterInput}>
        <Input
          value={parameter.numberValue?.toString() ?? ''}
          type="number"
          placeholder="0"
          onValueChange={text => {
            const num = Number(text)
            onValueChange({
              dataType: 'number',
              operator,
              parameter: { ...parameter, numberValue: isNaN(num) ? undefined : num },
            })
          }}
          className="min-w-64"
        />
      </Visibility>
    </FilterBasePopUp>
  )
}

const allData: Row[] = range(100).map(() => createRow())

const availableItems: FilterListItem[] = [
  {
    id: 'name',
    label: 'Name',
    dataType: 'text',
    tags: [],
  },
  {
    id: 'age',
    label: 'Age',
    dataType: 'number',
    tags: [],
    popUpBuilder: (props: FilterListPopUpBuilderProps) => <AgeFilterPopUp {...props} />,
  },
  {
    id: 'entryDate',
    label: 'Entry Date',
    dataType: 'date',
    tags: [],
  },
  {
    id: 'hasChildren',
    label: 'Has Children',
    dataType: 'boolean',
    tags: [],
  },
]

const sortingAvailableItems: SortingListItem[] = availableItems.map(({ id, label, dataType }) => ({
  id,
  label,
  dataType,
}))

function filterData(data: Row[], filters: IdentifierFilterValue[]): Row[] {
  if (filters.length === 0) return data
  return data.filter(row => {
    return filters.every(f => {
      const rowValue = row[f.id as keyof Row]
      const fn = FilterFunctions[f.value.dataType as DataType]
      if (!fn) return true
      return fn(rowValue, f.value.operator, f.value.parameter)
    })
  })
}

function sortRows(data: Row[], sorting: ColumnSort[]): Row[] {
  if (sorting.length === 0) return data
  return [...data].sort((a, b) => {
    for (const sort of sorting) {
      const { id, desc } = sort
      const aValue = a[id as keyof Row]
      const bValue = b[id as keyof Row]
      let comparison = 0
      if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime()
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue)
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        comparison = Number(aValue) - Number(bValue)
      } else {
        if (aValue < bValue) comparison = -1
        else if (aValue > bValue) comparison = 1
      }
      if (comparison !== 0) {
        return desc ? -comparison : comparison
      }
    }
    return 0
  })
}

const meta: Meta<object> = {
  component: Table,
}

export default meta
type Story = StoryObj<typeof meta>

export const filterListTable: Story = {
  args: {},
  render: () => {
    const translation = useHightideTranslation()
    const [filterValue, setFilterValue] = useState<IdentifierFilterValue[]>([])
    const [sorting, setSorting] = useState<ColumnSort[]>([])

    const tableData = useMemo(() => {
      const filtered = filterData(allData, filterValue)
      return sortRows(filtered, sorting)
    }, [filterValue, sorting])

    return (
      <Table
        table={{
          data: tableData,
          manualSorting: true,
          manualFiltering: true,
          enableColumnFilters: false,
          enableSorting: false,
          enableColumnPinning: false,
          initialState: {
            pagination: { pageSize: 10 },
          },
        }}
        header={(
          <div className="flex-col-2 w-full">
            <div className="flex-row-8 justify-between items-center">
              <span className="typography-title-md">{'Table with Filter and Sorting Lists'}</span>
              <TableColumnSwitcher/>
            </div>
            <span className="text-description typography-label-md">
              {tableData.length} of {allData.length} rows
            </span>
            <FilterList
              value={filterValue}
              onValueChange={value => {
                setFilterValue(value)
              }}
              availableItems={availableItems}
            />
            <SortingList
              sorting={sorting}
              onSortingChange={setSorting}
              availableItems={sortingAvailableItems}
            />
          </div>
        )}
      >
        <TableColumn
          id="name"
          header={translation('name')}
          accessorKey="name"
          minSize={150}
          size={200}
        />
        <TableColumn
          id="age"
          header={translation('age')}
          accessorKey="age"
          minSize={100}
          size={120}
        />
        <TableColumn
          id="entryDate"
          header={translation('entryDate')}
          accessorKey="entryDate"
          cell={({ cell }) => (
            <TableCell>
              {DateUtils.toInputString(cell.getValue() as Date, 'date')}
            </TableCell>
          )}
          minSize={140}
          size={160}
        />
        <TableColumn
          id="hasChildren"
          header="Has Children"
          accessorKey="hasChildren"
          cell={({ cell }) => (
            <TableCell>
              {cell.getValue() ? translation('yes') : translation('no')}
            </TableCell>
          )}
          minSize={100}
          size={120}
        />
      </Table>
    )
  },
}
