import clsx from 'clsx'
import { Checkbox } from '@/src/components/user-interaction/Checkbox'
import { FillerCell } from './FillerCell'
import type { TableProviderProps } from './TableContext'
import { TableProvider } from './TableContext'
import { TableColumn } from './TableColumn'
import type { RowSelectionState } from '@tanstack/react-table'

export interface TableWithSelectionProviderProps<T> extends TableProviderProps<T> {
    rowSelection: RowSelectionState,
    disableClickRowClickSelection?: boolean,
    selectionRowId?: string,
}

export const TableWithSelectionProvider = <T,>({
  children,
  state,
  fillerRow,
  rowSelection,
  disableClickRowClickSelection = false,
  selectionRowId = 'selection',
  onRowClick,
  meta,
  ...props
}: TableWithSelectionProviderProps<T>) => {
  return (
    <TableProvider
      {...props}
      fillerRow={(columnId, table) => {
        if (columnId === selectionRowId) {
          return (<Checkbox value={false} disabled={true} className="max-w-6" />)
        }
        return fillerRow?.(columnId, table) ?? (<FillerCell />)
      }}
      initialState={{
        ...props.initialState,
        columnPinning: {
          ...props.initialState?.columnPinning,
          left: [selectionRowId, ...(props.initialState?.columnPinning?.left ?? [])],
        },
      }}
      state={{
        rowSelection,
        ...state
      }}
      onRowClick={(row, table) => {
        if (!disableClickRowClickSelection) {
          row.toggleSelected()
        }
        onRowClick?.(row, table)
      }}
      meta={{
        ...meta,
        bodyRowClassName: clsx(
          { 'cursor-pointer': !disableClickRowClickSelection },
          meta?.bodyRowClassName
        )
      }}
    >
      <TableColumn
        id={selectionRowId}
        header={({ table }) => {
          return (
            <Checkbox
              value={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onValueChange={value => {
                const newValue = !!value
                table.toggleAllRowsSelected(newValue)
              }}
            />
          )
        }}
        cell={({ row }) => {
          return (
            <Checkbox
              disabled={!row.getCanSelect()}
              value={row.getIsSelected()}
              onValueChange={row.getToggleSelectedHandler()}
            />
          )
        }}
        size={60}
        minSize={60}
        maxSize={60}
        enableResizing={false}
        enableSorting={false}
        enableHiding={false}
        enableColumnFilter={false}
      />
      {children}
    </TableProvider>
  )
}