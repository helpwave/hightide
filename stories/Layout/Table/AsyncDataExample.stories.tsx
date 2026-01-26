import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState, useEffect, useMemo } from 'react'
import { faker } from '@faker-js/faker'
import { range } from '@/src/utils/array'
import { TableColumn } from '@/src/components/layout/table/TableColumn'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { TableCell } from '@/src/components/layout/table/TableCell'
import type { TableState, SortingState, ColumnFiltersState, PaginationState, TableOptions } from '@tanstack/react-table'
import { TableColumnSwitcher } from '@/src/components/layout/table/TableColumnSwitcher'
import { Chip } from '@/src/components/display-and-visualization/Chip'
import { Table } from '@/src/components/layout/table/Table'
import { Visibility } from '@/src/components/layout/Visibility'
import {
  filterText,
  filterNumber,
  filterDate,
  filterDatetime,
  filterBoolean,
  filterTags,
  filterTagsSingle,
  filterGeneric
} from '@/src/utils/filter'
import {
  TableFilterOperator,
  type TextFilterValue,
  type NumberFilterValue,
  type DateFilterValue,
  type DatetimeFilterValue,
  type BooleanFilterValue,
  type TagsFilterValue,
  type TagsSingleFilterValue,
  type GenericFilterValue,
  type TableFilterValue
} from '@/src/components/layout/table/TableFilter'

const relationShipTags = ['Friend', 'Family', 'Work', 'School', 'Other'] as const
type RelationShipTag = (typeof relationShipTags)[number]

const hobbyTags = ['Reading', 'Writing', 'Coding', 'Gaming', 'Other'] as const
type HobbyTag = (typeof hobbyTags)[number]

type DataType = {
  name: string,
  age: number,
  street: string,
  entryDate: Date,
  lastOnlineDate: Date,
  tags: RelationShipTag[],
  hobbies: HobbyTag | null,
  hasChildren: boolean,
}

const createRandomDataType = (): DataType => {
  return {
    name: faker.person.fullName(),
    street: faker.location.streetAddress(),
    age: faker.number.int(100),
    entryDate: faker.date.past({ years: 20 }),
    lastOnlineDate: faker.date.past({ years: 20 }),
    tags: faker.helpers.arrayElements(relationShipTags, { min: 0, max: 3 }),
    hobbies: faker.helpers.arrayElements(hobbyTags, { min: 0, max: 1 })[0] ?? null,
    hasChildren: faker.datatype.boolean(),
  }
}

const TOTAL_ITEMS = 10000
const allData: DataType[] = range(TOTAL_ITEMS).map(() => createRandomDataType())

/**
 * Determines the filter category based on the operator string.
 */
function getFilterCategory(operator: string): keyof typeof TableFilterOperator | null {
  const allOperators = [
    ...TableFilterOperator.generic,
    ...TableFilterOperator.text,
    ...TableFilterOperator.number,
    ...TableFilterOperator.date,
    ...TableFilterOperator.dateTime,
    ...TableFilterOperator.boolean,
    ...TableFilterOperator.tags,
    ...TableFilterOperator.tagsSingle,
  ] as readonly string[]

  if (!allOperators.includes(operator)) {
    return null
  }

  if (TableFilterOperator.generic.includes(operator as typeof TableFilterOperator.generic[number])) {
    return 'generic'
  }
  if (TableFilterOperator.text.includes(operator as typeof TableFilterOperator.text[number])) {
    return 'text'
  }
  if (TableFilterOperator.number.includes(operator as typeof TableFilterOperator.number[number])) {
    return 'number'
  }
  if (TableFilterOperator.date.includes(operator as typeof TableFilterOperator.date[number])) {
    return 'date'
  }
  if (TableFilterOperator.dateTime.includes(operator as typeof TableFilterOperator.dateTime[number])) {
    return 'dateTime'
  }
  if (TableFilterOperator.boolean.includes(operator as typeof TableFilterOperator.boolean[number])) {
    return 'boolean'
  }
  if (TableFilterOperator.tags.includes(operator as typeof TableFilterOperator.tags[number])) {
    return 'tags'
  }
  if (TableFilterOperator.tagsSingle.includes(operator as typeof TableFilterOperator.tagsSingle[number])) {
    return 'tagsSingle'
  }
  return null
}

const fetchPaginatedData = async (
  pageIndex: number,
  pageSize: number,
  sorting: SortingState,
  columnFilters: ColumnFiltersState
): Promise<{ data: DataType[], totalCount: number }> => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  let filteredData = [...allData]

  columnFilters.forEach(filter => {
    const { id, value } = filter
    if (!value) return

    filteredData = filteredData.filter(row => {
      const rowValue = row[id as keyof DataType]

      if (typeof value === 'object' && 'operator' in value && 'parameter' in value) {
        const filterValue = value as TableFilterValue
        const category = getFilterCategory(filterValue.operator)

        if (!category) {
          return true
        }

        switch (category) {
        case 'text':
          return filterText(rowValue, filterValue as TextFilterValue)
        case 'number':
          return filterNumber(rowValue, filterValue as NumberFilterValue)
        case 'date':
          return filterDate(rowValue, filterValue as DateFilterValue)
        case 'dateTime':
          return filterDatetime(rowValue, filterValue as DatetimeFilterValue)
        case 'boolean':
          return filterBoolean(rowValue, filterValue as BooleanFilterValue)
        case 'tags':
          return filterTags(rowValue, filterValue as TagsFilterValue)
        case 'tagsSingle':
          return filterTagsSingle(rowValue, filterValue as TagsSingleFilterValue)
        case 'generic':
          return filterGeneric(rowValue, filterValue as GenericFilterValue)
        default:
          return true
        }
      }

      return true
    })
  })

  if (sorting.length > 0) {
    filteredData.sort((a, b) => {
      for (const sort of sorting) {
        const { id, desc } = sort
        const aValue = a[id as keyof DataType]
        const bValue = b[id as keyof DataType]

        let comparison = 0
        if (aValue < bValue) comparison = -1
        else if (aValue > bValue) comparison = 1

        if (comparison !== 0) {
          return desc ? -comparison : comparison
        }
      }
      return 0
    })
  }

  const totalCount = filteredData.length
  const startIndex = pageIndex * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalCount)
  const data = filteredData.slice(startIndex, endIndex)

  return {
    data,
    totalCount,
  }
}

const usePaginatedData = (
  pageIndex: number,
  pageSize: number,
  sorting: SortingState,
  columnFilters: ColumnFiltersState
) => {
  const [data, setData] = useState<DataType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    fetchPaginatedData(pageIndex, pageSize, sorting, columnFilters)
      .then(result => {
        setData(result.data)
        setTotalCount(result.totalCount)
        setIsLoading(false)
      })
      .catch(err => {
        setError(err)
        setIsLoading(false)
      })
  }, [pageIndex, pageSize, sorting, columnFilters])

  return { data, isLoading, error, totalCount }
}

type StoryArgs = Omit<TableOptions<DataType>, 'data' | 'children' | 'initialState'> & {
  isSticky?: boolean,
}

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>

export const asyncDataExample: Story = {
  args: {
    isSticky: false,
  },
  render: ({ isSticky, ...args }) => {
    const translation = useHightideTranslation()
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const { data, isLoading, error, totalCount } = usePaginatedData(pagination.pageIndex, pagination.pageSize, sorting, columnFilters)

    const pageCount = useMemo(() => Math.ceil(totalCount / pagination.pageSize), [totalCount, pagination.pageSize])

    return (
      <Table
        {...args}
        table={{
          data,
          manualPagination: true,
          manualSorting: true,
          manualFiltering: true,
          pageCount,
          state: {
            pagination,
            sorting,
            columnFilters,
          } as Partial<TableState> as TableState,
          onPaginationChange: setPagination,
          onSortingChange: (updater) => {
            setSorting(updater)
            setPagination({ ...pagination, pageIndex: 0 })
          },
          onColumnFiltersChange: (updater) => {
            setColumnFilters(updater)
            setPagination({ ...pagination, pageIndex: 0 })
          },
        }}
        header={(
          <div className="flex-row-2 items-center justify-between w-full">
            <div className="flex-col-0">
              <span className="typography-title-md">{'Paginated Data Fetching'}</span>
              <Visibility isVisible={!!error}>
                <span className="typography-label-md text-negative">Error: {error?.message}</span>
              </Visibility>
              <Visibility isVisible={!error}>
                <Visibility isVisible={!!isLoading}>
                  <span className="text-description typography-label-md">Loading...</span>
                </Visibility>
                <Visibility isVisible={!isLoading}>
                  <span className="text-description typography-label-md">{`${totalCount} items loaded`}</span>
                </Visibility>
              </Visibility>
            </div>
            <div className="flex-row-2 items-center">
              <TableColumnSwitcher/>
            </div>
          </div>
        )}
        displayProps={isSticky ? {
          tableHeaderProps: {
            isSticky: true,
          },
          containerProps: {
            className: 'max-h-128',
          },
        } : undefined}
      >
        <TableColumn
          id="name"
          header={translation('name')}
          accessorKey="name"
          sortingFn="textCaseSensitive"
          minSize={150}
          size={200}
          maxSize={400}
          filterType="text"
        />
        <TableColumn
          id="age"
          header={translation('age')}
          accessorKey="age"
          sortingFn="alphanumeric"
          minSize={140}
          size={160}
          maxSize={250}
          filterType="number"
        />
        <TableColumn
          id="street"
          header={translation('street')}
          accessorKey="street"
          sortingFn="text"
          minSize={250}
          size={250}
          maxSize={400}
          filterType="text"
        />
        <TableColumn
          id="entryDate"
          header={translation('entryDate')}
          cell={({ cell }) => (
            <TableCell>
              {(cell.getValue() as Date).toLocaleDateString()}
            </TableCell>
          )}
          accessorKey="entryDate"
          sortingFn="datetime"
          minSize={250}
          size={250}
          maxSize={400}
          filterType="date"
        />
        <TableColumn
          id="lastOnlineDate"
          header="Last Online"
          cell={({ cell }) => {
            const value = cell.getValue() as Date
            if(!value) return <TableCell>No last online date</TableCell>
            return (
              <TableCell>
                {value.toLocaleString()}
              </TableCell>
            )}}
          accessorKey="lastOnlineDate"
          sortingFn="datetime"
          minSize={250}
          size={250}
          maxSize={400}
          filterType="dateTime"
        />
        <TableColumn
          id="tags"
          header="Realationship"
          cell={({ cell }) => {
            const value = cell.getValue() as RelationShipTag[]
            if(value.length === 0) return <TableCell>No tags</TableCell>
            return (
              <div className="flex-row-2 flex-wrap gap-y-2">
                {value.map(tag => (<Chip key={tag}>{tag}</Chip>))}
              </div>
            )
          }}
          accessorKey="tags"
          minSize={300}
          size={300}
          maxSize={400}
          filterType="tags"
          meta={{
            filterData: {
              tags: relationShipTags.map(tag => ({ tag, label: tag })),
            },
          }}
        />
        <TableColumn
          id="hobbies"
          header="Hobbies"
          cell={({ cell }) => {
            const value = cell.getValue() as HobbyTag | null
            if(!value) return <TableCell>No hobbies</TableCell>
            return (
              <div className="flex-row-2 flex-wrap gap-y-2">
                {value ? (<Chip key={value}>{value}</Chip>) : null}
              </div>
            )
          }}
          accessorKey="hobbies"
          minSize={200}
          size={250}
          maxSize={300}
          filterType="tagsSingle"
          sortingFn="text"
          meta={{
            filterData: {
              tags: hobbyTags.map(tag => ({ tag, label: tag })),
            },
          }}
        />
        <TableColumn
          id="hobbies"
          header="Hobbies"
          cell={({ cell }) => {
            const value = cell.getValue() as HobbyTag | null
            if(!value) return <TableCell>No hobbies</TableCell>
            return (
              <div className="flex-row-2 flex-wrap gap-y-2">
                {value ? (<Chip key={value}>{value}</Chip>) : null}
              </div>
            )
          }}
          accessorKey="hobbies"
          minSize={200}
          size={250}
          maxSize={300}
          filterType="tagsSingle"
          sortingFn="text"
          meta={{
            filterData: {
              tags: hobbyTags.map(tag => ({ tag, label: tag })),
            },
          }}
        />
        <TableColumn
          id="hasChildren"
          header="Has Children"
          cell={({ cell }) => (
            <TableCell>
              {cell.getValue() as boolean ? translation('yes') : translation('no')}
            </TableCell>
          )}
          accessorKey="hasChildren"
          minSize={200}
          size={200}
          maxSize={300}
          filterType="boolean"
        />
      </Table>
    )
  },
}
