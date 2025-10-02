import type { Meta, StoryObj } from '@storybook/nextjs'
import { useMemo, useState } from 'react'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import { faker } from '@faker-js/faker'
import { range } from '../../src/utils/array'
import type { TableProps } from '../../src/components/table/Table'
import { TableWithSelection } from '../../src/components/table/Table'
import type { Translation } from '../../src/localization/useTranslation'
import { useTranslation } from '../../src/localization/useTranslation'
import { TableCell } from '../../src/components/table/TableCell'
import { SolidButton } from '../../src/components/user-action/Button'

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

const exampleData: DataType[] = range(100).map(() => createRandomDataType())

type TranslationType = {
  id: string,
  name: string,
  age: string,
  street: string,
  entryDate: string,
}

const defaultTranslation: Translation<TranslationType> = {
  en: {
    id: 'Identifier',
    name: 'Name',
    age: 'Age',
    street: 'Street',
    entryDate: 'Entry Date'
  },
  de: {
    id: 'ID',
    name: 'Name',
    age: 'Alter',
    street: 'Straße',
    entryDate: 'Eintragsdatum'
  }
}

type TableExampleProps = Omit<TableProps<DataType>, 'data' | 'setData' | 'columns' | 'initialState'>

const TableExample = ({ ...props }: TableExampleProps) => {
  const translation = useTranslation([defaultTranslation])
  const [data, setData] = useState<DataType[]>(exampleData)
  const [selection, setSelection] = useState<RowSelectionState>(
    exampleData.reduce((previousValue, _, currentIndex) => {
      if (currentIndex % 2 === 0) {
        return {
          ...previousValue,
          [currentIndex]: true
        }
      }
      return previousValue
    }, {})
  )

  const columns = useMemo<ColumnDef<DataType>[]>(() => [
    {
      id: 'id',
      header: translation('id'),
      accessorKey: 'id',
      minSize: 200,
      size: 250,
      maxSize: 300,
      meta: {
        filterType: 'text'
      },
    },
    {
      id: 'name',
      header: translation('name'),
      accessorKey: 'name',
      sortingFn: 'textCaseSensitive',
      minSize: 150,
      size: 200,
      maxSize: 400,
      meta: {
        filterType: 'text'
      },
    },
    {
      id: 'age',
      header: translation('age'),
      accessorKey: 'age',
      sortingFn: 'alphanumeric',
      minSize: 140,
      size: 160,
      maxSize: 250,
      meta: {
        filterType: 'range'
      },
    },
    {
      id: 'street',
      header: translation('street'),
      accessorKey: 'street',
      sortingFn: 'text',
      minSize: 250,
      size: 250,
      maxSize: 400,
      meta: {
        filterType: 'text'
      },
    },
    {
      id: 'entryDate',
      header: translation('entryDate'),
      cell: ({ cell }) => (
        <TableCell>
          {(cell.getValue() as Date).toLocaleDateString()}
        </TableCell>
      ),
      footer: props => props.column.id,
      accessorKey: 'entryDate',
      sortingFn: 'datetime',
      minSize: 250,
      size: 250,
      maxSize: 400,
      filterFn: 'dateRange',
      meta: {
        filterType: 'dateRange'
      },
    },
  ], [translation])

  return (
    <div className="flex-col-3">
      <div className="flex-row-2 justify-between items-center">
        <h2 className="typography-title-md">Address book</h2>
        <div className="flex-row-2 items-center">
          {Object.keys(selection).length > 0 && (
            <SolidButton size="small" color="negative" onClick={() => {
              setData(prevState => prevState.filter((_, index) => !selection[index]))
              setSelection({})
            }}>
              Delete
            </SolidButton>
          )}
          <SolidButton
            size="small"
            onClick={() => setData(data => [...data, createRandomDataType()])}
          >
            Add Item
          </SolidButton>
          <SolidButton
            size="small"
            onClick={() => setData(data => [...data, ...range(1000).map(_ => createRandomDataType())])}
          >
            Add 1000 Items
          </SolidButton>
        </div>
      </div>
      <TableWithSelection
        {...props}
        data={data}
        columns={columns}
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        initialState={{
          pagination: {
            pageSize: 10,
          },
        }}
      />
    </div>
  )
}

const meta: Meta<typeof TableExample> = {
  title: 'Layout',
  component: TableExample,
}

export default meta
type Story = StoryObj<typeof meta>;

export const table: Story = {
  args: {
    enableColumnResizing: true,
    className: '',
  }
}
