import type { Meta, StoryObj } from '@storybook/nextjs'
import { useMemo, useState } from 'react'
import type { TableProps, Translation } from '../../src'
import { range, SolidButton, TableWithSelection, useTranslation } from '../../src'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import { faker } from '@faker-js/faker'

type DataType = {
  id: string,
  name: string,
  age: number,
  street: string,
}

const createRandomDataType = (): DataType => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    street: faker.location.streetAddress(),
    age: faker.number.int(100),
  }
}

const exampleData: DataType[] = range(0, 500).map(() => createRandomDataType())

type TranslationType = {
  id: string,
  name: string,
  age: string,
  street: string,
}

const defaultTranslation: Translation<TranslationType> = {
  en: {
    id: 'Identifier',
    name: 'Name',
    age: 'Age',
    street: 'Street',
  },
  de: {
    id: 'ID',
    name: 'Name',
    age: 'Alter',
    street: 'Straße',
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
      cell: ({ cell }) => (
        <span className="block max-w-full overflow-ellipsis truncate">
            {cell.getValue() as string}
        </span>
      ),
      footer: props => props.column.id,
      accessorKey: 'id',
      minSize: 200,
      size: 250,
      maxSize: 300,
    },
    {
      id: 'name',
      header: translation('name'),
      footer: props => props.column.id,
      accessorKey: 'name',
      sortingFn: 'textCaseSensitive',
      minSize: 150,
      size: 200,
      maxSize: 400,
    },
    {
      id: 'age',
      header: translation('age'),
      footer: props => props.column.id,
      accessorKey: 'age',
      sortingFn: 'alphanumeric',
      minSize: 140,
      size: 160,
      maxSize: 250,
    },
    {
      id: 'street',
      header: translation('street'),
      footer: props => props.column.id,
      accessorKey: 'street',
      sortingFn: 'text',
      minSize: 250,
      size: 250,
      maxSize: 600,
    },
  ], [translation])

  return (
    <div className="col gap-y-2">
      <div className="row justify-between items-center">
        <h2 className="textstyle-title-md h-10">Address book</h2>
        <div className="row items-center">
          {Object.keys(selection).length > 0 && (
            <SolidButton size="small" color="negative" onClick={() => {
              setData(prevState => prevState.filter((_, index) => !!selection[index]))
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
        </div>
      </div>
      <TableWithSelection
        {...props}
        data={data}
        setData={setData}
        columns={columns}
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        initialState={{
          pagination: {
            pageSize: 5,
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
    allowResizing: true,
    className: '',
  }
}
