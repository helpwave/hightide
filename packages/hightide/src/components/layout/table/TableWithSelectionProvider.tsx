import { Checkbox } from '@/src/components/user-interaction/Checkbox'
import { FillerCell } from './FillerCell'
import type { TableProviderProps } from './TableProvider'
import { TableProvider } from './TableProvider'
import type { ColumnDef, Row, RowSelectionState, Table } from '@tanstack/react-table'
import { useCallback, useMemo } from 'react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { TableStateWithoutSizingContext } from './TableContext'

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
  const translation = useHightideTranslation()
  const columnDef: ColumnDef<T, unknown>[] = useMemo(() => [
    {
      id: selectionRowId,
      header: () => {
        return (
          <TableStateWithoutSizingContext.Consumer>
            {(context) => {
              const table = context?.table
              return (
                <Checkbox
                  value={table?.getIsAllRowsSelected()}
                  indeterminate={table?.getIsSomeRowsSelected()}
                  onValueChange={value => {
                    const newValue = !!value
                    table?.toggleAllRowsSelected(newValue)
                  }}
                  disabled={(table?.getRowCount() ?? 0) < 1}
                />
              )
            }}
          </TableStateWithoutSizingContext.Consumer>
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
      meta: {
        columnLabel: translation('selection'),
      },
    },
    ...(props.columns ?? []),
  ], [selectionRowId, props.columns, translation])

  const placeholderColumnExcludeIds = useMemo(() => [selectionRowId], [selectionRowId])

  return (
    <TableProvider
      {...props}
      placeholderColumnExcludeIds={placeholderColumnExcludeIds}
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