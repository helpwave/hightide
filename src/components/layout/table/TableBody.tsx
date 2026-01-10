import { range } from '@/src/utils/array'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'
import type { Row } from '@tanstack/react-table'
import { flexRender, type Table as ReactTable } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { FillerCell } from './FillerCell'
import React from 'react'

export type TableBodyProps<T> = {
  table: ReactTable<T>,
  onRowClick?: (row: Row<T>, table: ReactTable<T>) => void,
  isUsingFillerRows?: boolean,
  fillerRow?: (columnId: string, table: ReactTable<T>) => ReactNode,
}

const TableBodyVisual = <T,>({
  table,
  onRowClick,
  fillerRow,
  isUsingFillerRows,
}: TableBodyProps<T>) => {
  const columns = table.getAllColumns()

  return (
    <tbody>
      {table.getRowModel().rows.map(row => {
        return (
          <tr
            key={row.id}
            onClick={() => onRowClick?.(row, table)}
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
      {isUsingFillerRows && range(table.getState().pagination.pageSize - table.getRowModel().rows.length, { allowEmptyRange: true }).map((row, index) => {
        return (
          <tr key={'filler-row-' + index} data-name="table-body-filler-row">
            {columns.map((column) => {
              return (
                <td key={column.id} data-name="table-body-filler-cell">
                  {fillerRow ? fillerRow(column.id, table) : (<FillerCell />)}
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
    return (
      prevProps.table.options.data === nextProps.table.options.data &&
          prevProps.isUsingFillerRows === nextProps.isUsingFillerRows
    )
  }
)


export const TableBody = <T,>(
  props: TableBodyProps<T>
) => {
  const TableBodyComponent = TableBodyFactory<T>()
  return <TableBodyComponent {...props} />
}
