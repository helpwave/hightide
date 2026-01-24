import { range } from '@/src/utils/array'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'
import { flexRender } from '@tanstack/react-table'
import { FillerCell } from './FillerCell'
import React from 'react'
import { useTableDataContext } from './TableContext'
import clsx from 'clsx'

export const TableBody = React.memo(function TableBodyVisual() {
  const { table, onRowClick, isUsingFillerRows, fillerRow, pagination, rows } = useTableDataContext<unknown>()
  const columns = table.getAllColumns()

  return (
    <tbody>
      {rows.map(row => {
        return (
          <tr
            key={row.id}
            onClick={() => onRowClick?.(row, table)}
            className={clsx('table-body-row', BagFunctionUtil.resolve(table.options.meta?.bodyRowClassName, row.original))}
          >
            {row.getVisibleCells().map(cell => {
              return (
                <td key={cell.id} className={clsx('table-body-cell', cell.column.columnDef.meta?.className)}>
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
      {isUsingFillerRows && range(pagination.pageSize - rows.length, { allowEmptyRange: true }).map((row, index) => {
        return (
          <tr key={'filler-row-' + index} className={clsx('table-body-filler-row')}>
            {columns.map((column) => {
              return (
                <td key={column.id} className={clsx('table-body-filler-cell', column.columnDef.meta?.className)}>
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
