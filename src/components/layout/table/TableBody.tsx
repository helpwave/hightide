import { range } from '@/src/utils/array'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'
import { flexRender } from '@tanstack/react-table'
import { FillerCell } from './FillerCell'
import React from 'react'
import { useTableDataContext } from './TableContext'
import clsx from 'clsx'
import { PropsUtil } from '@/src/utils/propsUtil'
import { Visibility } from '../Visibility'

export const TableBody = React.memo(function TableBodyVisual() {
  const { table, onRowClick, onFillerRowClick, isUsingFillerRows, fillerRowCell, pagination, rows } = useTableDataContext<unknown>()
  const state = table.getState()
  const baseOrder =
  state.columnOrder?.length
    ? state.columnOrder
    : table.getVisibleLeafColumns().map(col => col.id)

  const pinnedLeft = state.columnPinning?.left ?? []
  const pinnedRight = state.columnPinning?.right ?? []

  const columnOrder = [
    ...pinnedLeft,
    ...baseOrder.filter(
      id => !pinnedLeft.includes(id) && !pinnedRight.includes(id)
    ),
    ...pinnedRight,
  ]

  const columns = columnOrder
    .map(id => table.getColumn(id))
    .filter(
      (col): col is NonNullable<typeof col> =>
        !!col && state.columnVisibility?.[col.id] !== false
    )

  return (
    <tbody>
      {rows.map(row => {
        return (
          <tr
            key={row.id}
            onClick={() => onRowClick?.(row, table)}
            data-clickable={PropsUtil.dataAttributes.bool(!!onRowClick)}
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
      <Visibility isVisible={isUsingFillerRows}>
        {range(pagination.pageSize - rows.length, { allowEmptyRange: true }).map((index) => {
          return (
            <tr
              key={'filler-row-' + index}
              className={clsx('table-body-filler-row')}
              onClick={() => onFillerRowClick?.(index, table)}
              data-clickable={PropsUtil.dataAttributes.bool(!!onFillerRowClick)}
            >
              {columns.map((column) => {
                return (
                  <td key={column.id} className={clsx('table-body-filler-cell', column.columnDef.meta?.className)}>
                    {fillerRowCell ? fillerRowCell(column.id, table) : (<FillerCell />)}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </Visibility>
    </tbody>
  )
})
