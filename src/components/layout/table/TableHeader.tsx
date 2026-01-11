import { PropsUtil } from '@/src/utils/propsUtil'
import { flexRender, type Table as ReactTable } from '@tanstack/react-table'
import clsx from 'clsx'
import { Visibility } from '../Visibility'
import { TableSortButton } from './TableSortButton'
import { TableFilterButton } from './TableFilterButton'
import { useTableContext } from './TableContext'

export type TableHeaderProps<T> = {
  table?: ReactTable<T>,
}

export const TableHeader = <T,>({ table: tableOverride }: TableHeaderProps<T>) => {
  const { tableState } = useTableContext<T>()

  const table = tableOverride ?? tableState
  const columnSizingInfo = table.getState().columnSizingInfo
  return (
    <>
      {table.getHeaderGroups().map((headerGroup) => (
        <colgroup key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <col
              key={header.id}
              style={{
                width: `calc(var(--header-${header?.id}-size) * 1px)`,
                minWidth: header.column.columnDef.minSize,
                maxWidth: header.column.columnDef.maxSize,
              }}
            />
          ))}
        </colgroup>
      ))}
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id} data-name={PropsUtil.dataAttributes.name('table-header-row')} className={table.options.meta?.headerRowClassName}>
            {headerGroup.headers.map(header => {
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}

                  data-name={PropsUtil.dataAttributes.name('table-header-cell')}
                  className={clsx('group/table-header-cell', header.column.columnDef.meta?.className)}
                >
                  <Visibility isVisible={!header.isPlaceholder}>
                    <div className="flex-row-1 items-center">
                      <Visibility isVisible={header.column.getCanSort()}>
                        <TableSortButton
                          sortDirection={header.column.getIsSorted()}
                          sortingIndexDisplay={{
                            index: header.column.getIsSorted() ? (header.column.getSortIndex() + 1) : -1,
                            sortingsCount: table.getState().sorting.length,
                          }}
                          onClick={() => {
                            const sorted = header.column.getIsSorted()
                            const isMulti = header.column.getCanMultiSort()
                            if (!isMulti) {
                              table.resetSorting()
                            }
                            if (!sorted) {
                              header.column.toggleSorting(true, isMulti)
                              return
                            } else if (sorted === 'desc') {
                              header.column.toggleSorting(false, isMulti)
                            }
                            if (sorted === 'asc') {
                              header.column.clearSorting()
                            }
                          }}
                        />
                      </Visibility>
                      <Visibility isVisible={header.column.getCanFilter() && !!header.column.columnDef.meta?.filterType}>
                        <TableFilterButton
                          column={header.column}
                          filterType={header.column.columnDef.meta?.filterType}
                        />
                      </Visibility>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </Visibility>
                  <Visibility isVisible={header.column.getCanResize()}>
                    <div
                      onPointerDown={header.getResizeHandler()}
                      onDoubleClick={() => {
                        header.column.resetSize()
                      }}

                      data-name="table-resize-indicator"
                      data-active={PropsUtil.dataAttributes.bool(
                        !!columnSizingInfo?.columnSizingStart
                            && !!columnSizingInfo?.columnSizingStart?.find(([id, _]) => id === header.column.id)
                      )}
                      data-disabled={PropsUtil.dataAttributes.bool(
                        !!columnSizingInfo?.columnSizingStart
                            && (columnSizingInfo.columnSizingStart?.length ?? 0) > 0
                            && !columnSizingInfo.columnSizingStart?.find(([id, _]) => id === header.column.id)
                      )}
                    />
                  </Visibility>
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
    </>
  )
}