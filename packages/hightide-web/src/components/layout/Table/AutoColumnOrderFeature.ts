import type { TableFeature, Table } from '@tanstack/react-table'

export const AutoColumnOrderFeature: TableFeature = {
  createTable: <T>(table: Table<T>) => {
    const oldSetColumnOrder = table.setColumnOrder

    table.setColumnOrder = (updater) => {
      let newOrder =
        typeof updater === 'function'
          ? updater(table.getState().columnOrder)
          : updater

      const columnIds = table.getAllColumns().map(c => c.id)
      newOrder = newOrder.filter(id => columnIds.includes(id))

      const missing = columnIds.filter(id => !newOrder.includes(id))
      newOrder = [...newOrder, ...missing]

      oldSetColumnOrder(newOrder)
    }

    const currentColumnIds = table.getAllColumns().map(c => c.id)
    const stateColumnOrder = table.getState().columnOrder

    if (!stateColumnOrder || stateColumnOrder.length === 0) {
      table.setColumnOrder(currentColumnIds)
    } else {
      table.setColumnOrder(stateColumnOrder)
    }

    return table
  },
}
