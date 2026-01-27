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

      const result = ColumnSizeUtil.calculate({
        previousSizing: table.getState().columnSizing,
        newSizing,
        columnIds: table.getAllColumns().map(column => column.id).filter(Boolean),
        target: {
          width: target,
          behaviour: 'equalOrHigher',
        },
        minWidthsPerColumn: table.getAllColumns().reduce((previousValue, currentValue) => {
          return {
            ...previousValue,
            [currentValue.id]: currentValue.columnDef.minSize ?? table.options.defaultColumn?.minSize ?? 20,
          }
        }, {}),
        maxWidthsPerColumn: table.getAllColumns().reduce((previousValue, currentValue) => {
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