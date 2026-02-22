import type { Meta, StoryObj } from '@storybook/nextjs'
import { useMemo, useState } from 'react'
import { faker } from '@faker-js/faker'
import { range } from '@/src/utils/array'
import { Table } from '@/src/components/layout/table/Table'
import { TableColumn } from '@/src/components/layout/table/TableColumn'
import { TableCell } from '@/src/components/layout/table/TableCell'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { FilterList } from '@/src/components/user-interaction/data/FilterList'
import type { IdentifierFilterValue, FilterListItem } from '@/src/components/user-interaction/data/FilterList'
import { FilterFunctions } from '@/src/components/user-interaction/data/filter-function'
import type { DataType } from '@/src/components/user-interaction/data/data-types'

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

function filterData(data: Row[], filters: IdentifierFilterValue[]): Row[] {
  if (filters.length === 0) return data
  return data.filter(row => {
    return filters.every(f => {
      const rowValue = row[f.id as keyof Row]
      const fn = FilterFunctions[f.dataType as DataType]
      if (!fn) return true
      return fn(rowValue, f.operator, f.parameter)
    })
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

    const filteredData = useMemo(
      () => filterData(allData, filterValue),
      [filterValue]
    )

    return (
      <Table
        table={{
          data: filteredData,
          initialState: {
            pagination: { pageSize: 10 },
          },
        }}
        header={(
          <div className="flex-col-2 w-full">
            <span className="typography-title-md">Table with Filter List</span>
            <span className="text-description typography-label-md">
              {filteredData.length} of {allData.length} rows
            </span>
            <FilterList
              value={filterValue}
              onValueChange={setFilterValue}
              availableItems={availableItems}
            />
          </div>
        )}
      >
        <TableColumn
          id="name"
          header={translation('name')}
          accessorKey="name"
          sortingFn="textCaseSensitive"
          minSize={150}
          size={200}
        />
        <TableColumn
          id="age"
          header={translation('age')}
          accessorKey="age"
          sortingFn="alphanumeric"
          minSize={100}
          size={120}
        />
        <TableColumn
          id="entryDate"
          header={translation('entryDate')}
          accessorKey="entryDate"
          cell={({ cell }) => (
            <TableCell>
              {(cell.getValue() as Date).toLocaleDateString()}
            </TableCell>
          )}
          sortingFn="datetime"
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
          sortingFn="basic"
          minSize={100}
          size={120}
        />
      </Table>
    )
  },
}
