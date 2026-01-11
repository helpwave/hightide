import { range } from '@/src/utils/array'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'
import { flexRender, type Table as ReactTable } from '@tanstack/react-table'
import { FillerCell } from './FillerCell'
import React from 'react'
import { useTableContext } from './TableContext'

export type TableBodyProps<T> = {
  table?: ReactTable<T>,
}

const TableBodyVisual = <T,>({
  table: tableOverride,
}: TableBodyProps<T>) => {
  const { tableState, body } = useTableContext<T>()
  const table = tableOverride ?? tableState
  const columns = table.getAllColumns()

  return (
    <tbody>
      {table.getRowModel().rows.map(row => {
        return (
          <tr
            key={row.id}
            onClick={() => body.onRowClick?.(row, table)}
            data-name="table-body-row"
            className={BagFunctionUtil.resolve(table.options.meta?.bodyRowClassName, row.original)}
          >
            {row.getVisibleCells().map(cell => {
              return (
                <td key={cell.id} data-name="table-body-cell">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              )
            })}
          </tr>
        )
      })}
      {body.isUsingFillerRows && range(table.getState().pagination.pageSize - table.getRowModel().rows.length, { allowEmptyRange: true }).map((row, index) => {
        return (
          <tr key={'filler-row-' + index} data-name="table-body-filler-row">
            {columns.map((column) => {
              return (
                <td key={column.id} data-name="table-body-filler-cell">
                  {body.fillerRow ? body.fillerRow(column.id, table) : (<FillerCell />)}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  )
}

const TableBodyFactory = <T,>() => React.memo(
  TableBodyVisual<T>,
  (prevProps: TableBodyProps<T>, nextProps: TableBodyProps<T>) => {
    return prevProps.table.options.data === nextProps.table.options.data
  }
)


export const TableBody = <T,>(
  props: TableBodyProps<T>
) => {
  const TableBodyComponent = TableBodyFactory<T>()
  return <TableBodyComponent {...props} />
}
