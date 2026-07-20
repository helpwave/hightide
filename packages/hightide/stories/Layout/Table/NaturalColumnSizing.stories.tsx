import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useCallback, useState } from 'react'
import { faker } from '@faker-js/faker'
import { range } from '@helpwave/hightide-utils/utils'
import { Table } from '@/src/components/layout/table/Table'
import { TableColumn } from '@/src/components/layout/table/TableColumn'
import { Button } from '@/src/components/user-interaction/Button'
import { Chip } from '@/src/components/display-and-visualization/Chip'

type Row = {
  id: string,
  name: string,
  grade: string,
  city: string,
  note: string,
}

faker.seed(20260703)

const makeRow = (index: number, wide: boolean): Row => ({
  id: String(index + 1),
  name: faker.person.fullName(),
  grade: wide ? faker.helpers.arrayElement(['Level II-b', 'Stage III (critical)', 'A+']) : faker.helpers.arrayElement(['1', '2', '3']),
  city: faker.location.city(),
  note: wide ? faker.lorem.sentence() : faker.lorem.words(2),
})

const meta: Meta = {}

export default meta
type Story = StoryObj<typeof meta>

export const naturalColumnSizing: Story = {
  render: () => {
    const [rows, setRows] = useState<Row[]>(() => range(8).map((index) => makeRow(index, false)))

    const addWideRows = useCallback(() => {
      setRows(prev => [...prev, ...range([prev.length, prev.length + 4]).map((index) => makeRow(index, true))])
    }, [])

    return (
      <Table
        table={{
          data: rows,
          columnSizingMode: 'natural',
          isUsingFillerRows: false,
          initialState: { pagination: { pageIndex: 0, pageSize: 1000 } },
        }}
        paginationOptions={{ showPagination: false }}
        header={(
          <div className="flex-row-2 items-center justify-between w-full">
            <span className="typography-title-md">Natural column sizing</span>
            <Button onClick={addWideRows}>Load wider content</Button>
          </div>
        )}
      >
        <TableColumn id="id" header="ID" accessorKey="id" minSize={48}/>
        <TableColumn
          id="grade"
          header="Grade"
          accessorKey="grade"
          minSize={48}
          cell={({ cell }) => (<Chip size="sm">{cell.getValue() as string}</Chip>)}
        />
        <TableColumn id="name" header="Name" accessorKey="name" minSize={120}/>
        <TableColumn id="city" header="City" accessorKey="city" minSize={96}/>
        <TableColumn id="note" header="Note" accessorKey="note" minSize={120}/>
      </Table>
    )
  },
}
