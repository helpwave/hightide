import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import type { RowSelectionState } from '@tanstack/react-table'
import { faker } from '@faker-js/faker'
import { range } from '@/src/utils/array'
import type { TableWithSelectionProviderProps } from '@/src/components/layout/table/TableWithSelectionProvider'
import { TableWithSelectionProvider } from '@/src/components/layout/table/TableWithSelectionProvider'
import { TableColumn } from '@/src/components/layout/table/TableColumn'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { TableCell } from '@/src/components/layout/table/TableCell'
import { Button } from '@/src/components/user-interaction/Button'
import { TableDisplay } from '@/src/components/layout/table/TableDisplay'
import { TableColumnPicker } from '@/src/components/layout/table/TableColumnPicker'
import { TablePagination } from '@/src/components/layout/table/TablePagination'
import { Chip } from '@/src/components/display-and-visualization/Chip'
import { PopUpRoot } from '@/src/components/layout/popup/PopUpRoot'
import { PopUpOpener } from '@/src/components/layout/popup/PopUpOpener'

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

const exampleData: DataType[] = range(100).map(() => createRandomDataType())

type StoryArgs = Omit<TableWithSelectionProviderProps<DataType>, 'data' | 'rowSelection' | 'onRowSelectionChange' | 'children'>

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>

export const selection: Story = {
  args: {
    enableColumnResizing: true,
    enableMultiSort: true,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  },
  render: (args) => {
    const translation = useHightideTranslation()
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

    return (
      <div className="flex-col-3">
        <div className="flex-row-2 justify-between items-center">
          <h2 className="typography-title-md">Address book</h2>
          <div className="flex-row-2 items-center">
            {Object.keys(selection).length > 0 && (
              <Button color="negative" onClick={() => {
                setData(prevState => prevState.filter((_, index) => !selection[index]))
                setSelection({})
              }}>
                Delete
              </Button>
            )}
            <Button
              onClick={() => setData(data => [...data, createRandomDataType()])}
            >
              Add Item
            </Button>
            <Button
              onClick={() => setData(data => [...data, ...range(1000).map(_ => createRandomDataType())])}
            >
              Add 1000 Items
            </Button>
          </div>
        </div>
        <TableWithSelectionProvider
          {...args}
          data={data}
          rowSelection={selection}
          onRowSelectionChange={setSelection}
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
            <TablePagination/>
          </div>
        </TableWithSelectionProvider>
      </div>
    )
  },
}
