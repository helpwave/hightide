import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState, useEffect, useMemo } from 'react'
import { faker } from '@faker-js/faker'
import { range } from '@/src/utils/array'
import type { TableDisplayProps } from '@/src/components/layout/table/TableDisplay'
import { TableDisplay } from '@/src/components/layout/table/TableDisplay'
import { TableColumn } from '@/src/components/layout/table/TableColumn'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { TableCell } from '@/src/components/layout/table/TableCell'
import type { TableState, SortingState, ColumnFiltersState, PaginationState } from '@tanstack/react-table'
import { TableProvider } from '@/src/components/layout/table/TableProvider'
import { TableColumnPicker } from '@/src/components/layout/table/TableColumnPicker'
import { TablePageSizeController, TablePagination } from '@/src/components/layout/table/TablePagination'
import { PopUpRoot } from '@/src/components/layout/popup/PopUpRoot'
import { Button } from '@/src/components/user-interaction/Button'
import { PopUpOpener } from '@/src/components/layout/popup/PopUpOpener'
import { Chip } from '@/src/components/display-and-visualization/Chip'

const tags = ['Friend', 'Family', 'Work', 'School', 'Other'] as const
type Tag = (typeof tags)[number]

type DataType = {
  id: string,
  name: string,
  age: number,
  street: string,
  entryDate: Date,
  tags: Tag[],
  hasChildren: boolean,
}

const createRandomDataType = (): DataType => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    street: faker.location.streetAddress(),
    age: faker.number.int(100),
    entryDate: faker.date.past({ years: 20 }),
    tags: faker.helpers.arrayElements(tags, { min: 0, max: 3 }),
    hasChildren: faker.datatype.boolean(),
  }
}

const TOTAL_ITEMS = 10000
const allData: DataType[] = range(TOTAL_ITEMS).map(() => createRandomDataType())

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

      if (typeof value === 'object' && 'operator' in value) {
        const filterValue = value as { operator: string, parameter: unknown }
        const parameter = filterValue.parameter as Record<string, unknown>

        switch (filterValue.operator) {
        case 'textEquals': {
          const searchText = String(parameter.searchText ?? '').toLowerCase()
          const cellText = String(rowValue ?? '').toLowerCase()
          return cellText === searchText
        }
        case 'textNotEquals': {
          const searchText = String(parameter.searchText ?? '').toLowerCase()
          const cellText = String(rowValue ?? '').toLowerCase()
          return cellText !== searchText
        }
        case 'textNotWhitespace':
          return String(rowValue ?? '').trim().length > 0
        case 'textContains': {
          const searchText = String(parameter.searchText ?? '').toLowerCase()
          const cellText = String(rowValue ?? '').toLowerCase()
          return cellText.includes(searchText)
        }
        case 'textNotContains': {
          const searchText = String(parameter.searchText ?? '').toLowerCase()
          const cellText = String(rowValue ?? '').toLowerCase()
          return !cellText.includes(searchText)
        }
        case 'textStartsWith': {
          const searchText = String(parameter.searchText ?? '').toLowerCase()
          const cellText = String(rowValue ?? '').toLowerCase()
          return cellText.startsWith(searchText)
        }
        case 'textEndsWith': {
          const searchText = String(parameter.searchText ?? '').toLowerCase()
          const cellText = String(rowValue ?? '').toLowerCase()
          return cellText.endsWith(searchText)
        }
        case 'numberEquals':
          return Number(rowValue) === Number(parameter.compareValue ?? 0)
        case 'numberNotEquals':
          return Number(rowValue) !== Number(parameter.compareValue ?? 0)
        case 'numberGreaterThan':
          return Number(rowValue) > Number(parameter.compareValue ?? 0)
        case 'numberGreaterThanOrEqual':
          return Number(rowValue) >= Number(parameter.compareValue ?? 0)
        case 'numberLessThan':
          return Number(rowValue) < Number(parameter.compareValue ?? 0)
        case 'numberLessThanOrEqual':
          return Number(rowValue) <= Number(parameter.compareValue ?? 0)
        case 'numberBetween':
          return Number(rowValue) >= Number(parameter.min ?? -Infinity) && Number(rowValue) <= Number(parameter.max ?? Infinity)
        case 'numberNotBetween':
          return Number(rowValue) < Number(parameter.min ?? -Infinity) || Number(rowValue) > Number(parameter.max ?? Infinity)
        case 'dateEquals': {
          const filterDate = parameter.compareDate as Date | undefined
          if (!filterDate) return false
          const rowDate = rowValue as Date
          const normalizedRowDate = new Date(rowDate)
          normalizedRowDate.setHours(0, 0, 0, 0)
          const normalizedFilterDate = new Date(filterDate)
          normalizedFilterDate.setHours(0, 0, 0, 0)
          return normalizedRowDate.getTime() === normalizedFilterDate.getTime()
        }
        case 'dateNotEquals': {
          const filterDate = parameter.compareDate as Date | undefined
          if (!filterDate) return false
          const rowDate = rowValue as Date
          const normalizedRowDate = new Date(rowDate)
          normalizedRowDate.setHours(0, 0, 0, 0)
          const normalizedFilterDate = new Date(filterDate)
          normalizedFilterDate.setHours(0, 0, 0, 0)
          return normalizedRowDate.getTime() !== normalizedFilterDate.getTime()
        }
        case 'dateGreaterThan': {
          const filterDate = parameter.compareDate as Date | undefined
          if (!filterDate) return false
          const rowDate = rowValue as Date
          const normalizedRowDate = new Date(rowDate)
          normalizedRowDate.setHours(0, 0, 0, 0)
          const normalizedFilterDate = new Date(filterDate)
          normalizedFilterDate.setHours(0, 0, 0, 0)
          return normalizedRowDate > normalizedFilterDate
        }
        case 'dateGreaterThanOrEqual': {
          const filterDate = parameter.compareDate as Date | undefined
          if (!filterDate) return false
          const rowDate = rowValue as Date
          const normalizedRowDate = new Date(rowDate)
          normalizedRowDate.setHours(0, 0, 0, 0)
          const normalizedFilterDate = new Date(filterDate)
          normalizedFilterDate.setHours(0, 0, 0, 0)
          return normalizedRowDate >= normalizedFilterDate
        }
        case 'dateLessThan': {
          const filterDate = parameter.compareDate as Date | undefined
          if (!filterDate) return false
          const rowDate = rowValue as Date
          const normalizedRowDate = new Date(rowDate)
          normalizedRowDate.setHours(0, 0, 0, 0)
          const normalizedFilterDate = new Date(filterDate)
          normalizedFilterDate.setHours(0, 0, 0, 0)
          return normalizedRowDate < normalizedFilterDate
        }
        case 'dateLessThanOrEqual': {
          const filterDate = parameter.compareDate as Date | undefined
          if (!filterDate) return false
          const rowDate = rowValue as Date
          const normalizedRowDate = new Date(rowDate)
          normalizedRowDate.setHours(0, 0, 0, 0)
          const normalizedFilterDate = new Date(filterDate)
          normalizedFilterDate.setHours(0, 0, 0, 0)
          return normalizedRowDate <= normalizedFilterDate
        }
        case 'dateBetween': {
          const minDate = parameter.min as Date | undefined
          const maxDate = parameter.max as Date | undefined
          if (!minDate || !maxDate) return false
          const rowDate = rowValue as Date
          const normalizedRowDate = new Date(rowDate)
          normalizedRowDate.setHours(0, 0, 0, 0)
          const normalizedMinDate = new Date(minDate)
          normalizedMinDate.setHours(0, 0, 0, 0)
          const normalizedMaxDate = new Date(maxDate)
          normalizedMaxDate.setHours(0, 0, 0, 0)
          return normalizedRowDate >= normalizedMinDate && normalizedRowDate <= normalizedMaxDate
        }
        case 'dateNotBetween': {
          const minDate = parameter.min as Date | undefined
          const maxDate = parameter.max as Date | undefined
          if (!minDate || !maxDate) return false
          const rowDate = rowValue as Date
          const normalizedRowDate = new Date(rowDate)
          normalizedRowDate.setHours(0, 0, 0, 0)
          const normalizedMinDate = new Date(minDate)
          normalizedMinDate.setHours(0, 0, 0, 0)
          const normalizedMaxDate = new Date(maxDate)
          normalizedMaxDate.setHours(0, 0, 0, 0)
          return normalizedRowDate < normalizedMinDate || normalizedRowDate > normalizedMaxDate
        }
        case 'booleanIsTrue':
          return rowValue === true
        case 'booleanIsFalse':
          return rowValue === false
        case 'tagsEquals': {
          const searchTags = parameter.searchTags as unknown[] | undefined
          if (!Array.isArray(rowValue) || !Array.isArray(searchTags)) return false
          if (rowValue.length !== searchTags.length) return false
          const valueSet = new Set(rowValue)
          const searchTagsSet = new Set(searchTags)
          if (valueSet.size !== searchTagsSet.size) return false
          return Array.from(valueSet).every(tag => searchTagsSet.has(tag))
        }
        case 'tagsNotEquals': {
          const searchTags = parameter.searchTags as unknown[] | undefined
          if (!Array.isArray(rowValue) || !Array.isArray(searchTags)) return true
          if (rowValue.length !== searchTags.length) return true
          const valueSet = new Set(rowValue)
          const searchTagsSet = new Set(searchTags)
          if (valueSet.size !== searchTagsSet.size) return true
          return !Array.from(valueSet).every(tag => searchTagsSet.has(tag))
        }
        case 'tagsContains': {
          const searchTags = parameter.searchTags as unknown[] | undefined
          if (!Array.isArray(searchTags) || searchTags.length === 0) return false
          const rowTags = rowValue as Tag[]
          return Array.isArray(rowTags) && searchTags.every(tag => rowTags.includes(tag as Tag))
        }
        case 'tagsNotContains': {
          const searchTags = parameter.searchTags as unknown[] | undefined
          if (!Array.isArray(searchTags) || searchTags.length === 0) return true
          const rowTags = rowValue as Tag[]
          return !Array.isArray(rowTags) || !searchTags.every(tag => rowTags.includes(tag as Tag))
        }
        case 'undefined':
          return rowValue === undefined || rowValue === null
        case 'notUndefined':
          return rowValue !== undefined && rowValue !== null
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

type StoryArgs = Omit<TableDisplayProps<DataType>, 'data' | 'children' | 'initialState'>

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>

export const asyncDataExample: Story = {
  args: {
  },
  render: (args) => {
    const translation = useHightideTranslation()
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const { data, isLoading, error, totalCount } = usePaginatedData(pagination.pageIndex, pagination.pageSize, sorting, columnFilters)

    const pageCount = useMemo(() => Math.ceil(totalCount / pagination.pageSize), [totalCount, pagination.pageSize])

    return (
      <div className="flex-col-3">
        <div className="flex-row-2 justify-between items-center">
          <h2 className="typography-title-md">Paginated Data Fetching</h2>
          {isLoading && (
            <span className="typography-label-md">Loading...</span>
          )}
          {error && (
            <span className="typography-label-md text-negative">Error: {error.message}</span>
          )}
        </div>
        <TableProvider
          {...args}
          data={data}
          manualPagination={true}
          manualSorting={true}
          manualFiltering={true}
          pageCount={pageCount}
          state={{
            pagination,
            sorting,
            columnFilters,
          } as Partial<TableState> as TableState}
          onPaginationChange={setPagination}
          onSortingChange={(updater) => {
            setSorting(updater)
            setPagination({ ...pagination, pageIndex: 0 })
          }}
          onColumnFiltersChange={(updater) => {
            setColumnFilters(updater)
            setPagination({ ...pagination, pageIndex: 0 })
          }}
        >
          <div className="flex-col-2 items-center">
            <div className="flex-row-2 justify-end w-full">
              <PopUpRoot>
                <PopUpOpener>
                  {({ props }) => <Button {...props}>{translation('columns')}</Button>}
                </PopUpOpener>
                <TableColumnPicker/>
              </PopUpRoot>
            </div>
            <TableDisplay>
              <TableColumn
                id="id"
                header={translation('identifier')}
                accessorKey="id"
                minSize={200}
                size={250}
                maxSize={300}
                filterType="text"
                sortingFn="text"
              />
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
                id="tags"
                header="Tags"
                cell={({ cell }) => (
                  <div className="flex-row-2 flex-wrap gap-y-2">
                    {(cell.getValue() as Tag[]).map(tag => (<Chip key={tag}>{tag}</Chip>))}
                  </div>
                )}
                accessorKey="tags"
                minSize={300}
                size={300}
                maxSize={400}
                filterType="tags"
                meta={{
                  filterData: {
                    tags: tags.map(tag => ({ tag, label: tag })),
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
            </TableDisplay>
            <div className="relative">
              <TablePagination/>
              <TablePageSizeController pageSizeOptions={[10, 25, 50, 100, 200, 500]} buttonProps={{ className: 'absolute left-1/1 top-0 h-10' }}/>
            </div>
          </div>
        </TableProvider>
      </div>
    )
  },
}
