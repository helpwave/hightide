import { range } from '@/src/utils/array'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'
import { flexRender } from '@tanstack/react-table'
import { FillerCell } from './FillerCell'
import React from 'react'
import { useTableBodyContext } from './TableContext'

const TableBodyVisual = React.memo(function TableBodyVisual() {
  const { table, onRowClick, isUsingFillerRows, fillerRow, pagination } = useTableBodyContext<unknown>()
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
      {isUsingFillerRows && range(pagination.pageSize - table.getRowModel().rows.length, { allowEmptyRange: true }).map((row, index) => {
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
})



export const TableBody = TableBodyVisual
