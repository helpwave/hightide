import type { TableFeature } from '@tanstack/react-table'
import { ColumnSizeUtil } from './columnSizeUtil'

export const ColumnSizingWithTargetFeature: TableFeature = {
  createTable: (table) => {
    const oldSetColumnSizing = table.setColumnSizing

    table.setColumnSizing = (updater) => {
      const target = table.options.columnSizingTarget
      if(!target) {
        return oldSetColumnSizing(updater)
      }

      const newSizing = typeof updater === 'function' ? updater(table.getState().columnSizing) : updater

      const columnVisibility = table.getState().columnVisibility
      const columnPinning = table.getState().columnPinning

      const columnIdsLeft = []
      const columnIdsCenter = []
      const columnIdsRight = []
      for(const columnId of table.getState().columnOrder) {
        if(columnVisibility[columnId] ?? true) {
          if(columnPinning.left?.includes(columnId)) {
            columnIdsLeft.push(columnId)
          } else if(columnPinning.right?.includes(columnId)) {
            columnIdsRight.push(columnId)
          } else {
            columnIdsCenter.push(columnId)
          }
        }
      }
      const columnIds = [...columnIdsLeft, ...columnIdsCenter, ...columnIdsRight]
      const visibleSortedColumns = columnIds.length === 0 ?
        table.getVisibleLeafColumns().map(column => column.id).filter(Boolean)
        : columnIds

      console.log('column resizing', {
        columnIds,
        resultColumnIds: visibleSortedColumns,
        columnOrder: table.getState().columnOrder,
        columnVisibility,
        columnPinning,
        target,
      })

      const result = ColumnSizeUtil.calculate({
        previousSizing: table.getState().columnSizing,
        newSizing,
        columnIds: visibleSortedColumns,
        target: {
          width: target,
          behaviour: 'equalOrHigher',
        },
        minWidthsPerColumn: visibleSortedColumns.map(column => table.getColumn(column)).reduce((previousValue, currentValue) => {
          return {
            ...previousValue,
            [currentValue.id]: currentValue.columnDef.minSize ?? table.options.defaultColumn?.minSize ?? 20,
          }
        }, {}),
        maxWidthsPerColumn: visibleSortedColumns.map(column => table.getColumn(column)).reduce((previousValue, currentValue) => {
          return {
            ...previousValue,
            [currentValue.id]: currentValue.columnDef.maxSize ?? table.options.defaultColumn?.maxSize ?? 1000,
          }
        }, {}),
      })

      oldSetColumnSizing(result)
    }

    return table
  },
}