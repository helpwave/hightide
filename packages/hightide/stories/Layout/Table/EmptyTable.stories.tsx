import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import type { RowSelectionState } from '@tanstack/react-table'
import type { TableProviderProps } from '../../../src/components/layout/table/TableProvider'
import type { TableWithSelectionProviderProps } from '../../../src/components/layout/table/TableWithSelectionProvider'
import { Table, TableWithSelection } from '../../../src/components/layout/table/Table'

type EmptyRow = Record<string, never>

type StoryArgs = Omit<TableProviderProps<EmptyRow>, 'data' | 'children'>

const meta: Meta<StoryArgs> = {
  component: Table,
}

export default meta
type Story = StoryObj<typeof meta>

export const emptyTable: Story = {
  args: {
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  },
  render: (args) => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

    return (
      <div className="flex-col-8 w-full">
        <div className="flex-col-2">
          <span className="typography-title-md">{'Empty table'}</span>
          <Table
            table={{
              ...args,
              data: [],
            }}
            paginationOptions={{
              showPagination: false,
            }}
          />
        </div>
        <div className="flex-col-2">
          <span className="typography-title-md">{'Empty table with selection'}</span>
          <TableWithSelection
            table={{
              ...args,
              data: [],
              rowSelection,
              onRowSelectionChange: setRowSelection,
            } satisfies TableWithSelectionProviderProps<EmptyRow>}
            paginationOptions={{
              showPagination: false,
            }}
          />
        </div>
      </div>
    )
  },
}
