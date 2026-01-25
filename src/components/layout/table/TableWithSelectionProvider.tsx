import { Checkbox } from '@/src/components/user-interaction/Checkbox'
import { FillerCell } from './FillerCell'
import type { TableProviderProps } from './TableProvider'
import { TableProvider } from './TableProvider'
import type { Row, RowSelectionState, Table } from '@tanstack/react-table'
import { useCallback, useMemo } from 'react'

export interface TableWithSelectionProviderProps<T> extends TableProviderProps<T> {
    rowSelection: RowSelectionState,
    disableClickRowClickSelection?: boolean,
    selectionRowId?: string,
}

export const TableWithSelectionProvider = <T,>({
  children,
  state,
  fillerRowCell,
  rowSelection,
  disableClickRowClickSelection = false,
  selectionRowId = 'selection',
  onRowClick,
  ...props
}: TableWithSelectionProviderProps<T>) => {
  const columnDef = useMemo(() => [
    {
      id: selectionRowId,
      header: ({ table }) => {
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
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            disabled={!row.getCanSelect()}
            value={row.getIsSelected()}
            onValueChange={row.getToggleSelectedHandler()}
          />
        )
      },
      size: 60,
      minSize: 60,
      maxSize: 60,
      enableResizing: false,
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: false,
    },
    ...(props.columns ?? []),
  ], [selectionRowId, props.columns])

  return (
    <TableProvider
      {...props}
      fillerRowCell={useCallback((columnId: string, table: Table<T>) => {
        if (columnId === selectionRowId) {
          return (<Checkbox value={false} disabled={true} />)
        }
        return fillerRowCell?.(columnId, table) ?? (<FillerCell />)
      }, [fillerRowCell, selectionRowId])}
      columns={columnDef}
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
      onRowClick={useCallback((row: Row<T>, table: Table<T>) => {
        if (!disableClickRowClickSelection) {
          row.toggleSelected()
        }
        onRowClick?.(row, table)
      }, [disableClickRowClickSelection, onRowClick])}
    >
      {children}
    </TableProvider>
  )
}