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
      const existingColumnIds = new Set(table.getAllColumns().map(column => column.id))
      const visibleSortedColumns = (columnIds.length === 0 ?
        table.getVisibleLeafColumns().map(column => column.id).filter(Boolean)
        : columnIds
      ).filter(columnId => existingColumnIds.has(columnId))

      const result = ColumnSizeUtil.calculate({
        previousSizing: table.getState().columnSizing,
        newSizing,
        columnIds: visibleSortedColumns,
        target: {
          width: target,
          behaviour: 'equalOrHigher',
        },
        minWidthsPerColumn: visibleSortedColumns.reduce((previousValue, columnId) => {
          const column = table.getColumn(columnId)
          if(!column) return previousValue
          return {
            ...previousValue,
            [column.id]: column.columnDef.minSize ?? table.options.defaultColumn?.minSize ?? 20,
          }
        }, {}),
        maxWidthsPerColumn: visibleSortedColumns.reduce((previousValue, columnId) => {
          const column = table.getColumn(columnId)
          if(!column) return previousValue
          return {
            ...previousValue,
            [column.id]: column.columnDef.maxSize ?? table.options.defaultColumn?.maxSize ?? 1000,
          }
        }, {}),
      })
      oldSetColumnSizing(result)
    }

    return table
  },
}