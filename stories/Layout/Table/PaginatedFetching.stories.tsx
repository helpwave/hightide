import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState, useEffect, useMemo } from 'react'
import { faker } from '@faker-js/faker'
import { range } from '@/src/utils/array'
import type { TableDisplayProps } from '@/src/components/layout/table/TableDisplay'
import { TableDisplay } from '@/src/components/layout/table/TableDisplay'
import { TableColumn } from '@/src/components/layout/table/TableColumn'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { TableCell } from '@/src/components/layout/table/TableCell'
import type { TableState } from '@tanstack/react-table'
import { TableProvider } from '@/src/components/layout/table/TableContext'
import { TableColumnPicker } from '@/src/components/layout/table/TableColumnPicker'
import { TablePagination } from '@/src/components/layout/table/TablePagination'

type DataType = {
  id: string,
  name: string,
  age: number,
  street: string,
  entryDate: Date,
}

const createRandomDataType = (): DataType => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    street: faker.location.streetAddress(),
    age: faker.number.int(100),
    entryDate: faker.date.past({ years: 20 })
  }
}

const TOTAL_ITEMS = 1000
const allData: DataType[] = range(TOTAL_ITEMS).map(() => createRandomDataType())

const fetchPaginatedData = async (pageIndex: number, pageSize: number): Promise<{ data: DataType[], totalCount: number }> => {
  await new Promise(resolve => setTimeout(resolve, 500))

  const startIndex = pageIndex * pageSize
  const endIndex = Math.min(startIndex + pageSize, TOTAL_ITEMS)
  const data = allData.slice(startIndex, endIndex)

  return {
    data,
    totalCount: TOTAL_ITEMS,
  }
}

const usePaginatedData = (pageIndex: number, pageSize: number) => {
  const [data, setData] = useState<DataType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    fetchPaginatedData(pageIndex, pageSize)
      .then(result => {
        setData(result.data)
        setIsLoading(false)
      })
      .catch(err => {
        setError(err)
        setIsLoading(false)
      })
  }, [pageIndex, pageSize])

  return { data, isLoading, error, totalCount: TOTAL_ITEMS }
}

type StoryArgs = Omit<TableDisplayProps<DataType>, 'data' | 'children' | 'initialState'>

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>

export const paginatedFetching: Story = {
  args: {
  },
  render: (args) => {
    const PaginatedTable = () => {
      const translation = useHightideTranslation()
      const [pageIndex, setPageIndex] = useState(0)
      const [pageSize, setPageSize] = useState(10)

      const { data, isLoading, error, totalCount } = usePaginatedData(pageIndex, pageSize)

      const pageCount = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize])

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
            pageCount={pageCount}
            state={{
              pagination: {
                pageIndex,
                pageSize,
              },
            } as Partial<TableState> as TableState}
            onPaginationChange={(updater) => {
              const newPagination = typeof updater === 'function'
                ? updater({ pageIndex, pageSize })
                : updater
              setPageIndex(newPagination.pageIndex ?? 0)
              setPageSize(newPagination.pageSize ?? 10)
            }}
          >
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
              filterType="range"
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
              filterFn="dateRange"
              filterType="dateRange"
            />
            <div className="flex-col-2 items-center">
              <div className="flex-row-2 justify-end w-full">
                <TableColumnPicker/>
              </div>
              <TableDisplay/>
              <TablePagination/>
            </div>
          </TableProvider>
        </div>
      )
    }

    return <PaginatedTable />
  },
  parameters: {
    docs: {
      source: {
        code: `
const usePaginatedData = (pageIndex: number, pageSize: number) => {
  const [data, setData] = useState<DataType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    
    fetchPaginatedData(pageIndex, pageSize)
      .then(result => {
        setData(result.data)
        setIsLoading(false)
      })
      .catch(err => {
        setError(err)
        setIsLoading(false)
      })
  }, [pageIndex, pageSize])

  return { data, isLoading, error, totalCount: TOTAL_ITEMS }
}

const [pageIndex, setPageIndex] = useState(0)
const [pageSize, setPageSize] = useState(10)

const { data, isLoading, error, totalCount } = usePaginatedData(pageIndex, pageSize)

const pageCount = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize])

<Table
  {...args}
  data={data}
  manualPagination={true}
  pageCount={pageCount}
  state={{
    pagination: {
      pageIndex,
      pageSize,
    },
  }}
  onPaginationChange={(updater) => {
    const newPagination = typeof updater === 'function' 
      ? updater({ pageIndex, pageSize })
      : updater
    setPageIndex(newPagination.pageIndex ?? 0)
    setPageSize(newPagination.pageSize ?? 10)
  }}
>
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
  {/* ... more columns ... */}
</Table>
        `.trim(),
        language: 'tsx',
      },
    },
  },
}
