import type { TableHTMLAttributes } from 'react'
import { useRef } from 'react'
import './types'
import { TableBody } from './TableBody'
import type { TableHeaderProps } from './TableHeader'
import { TableHeader } from './TableHeader'
import { useTableContainerContext, useTableStateContext } from './TableContext'
import type { TableVirtualizationOptions } from './VirtualizedTableBody'
import { VirtualizedTableBody } from './VirtualizedTableBody'
import { useScrollbarState } from '@/src/hooks/useScrollbarState'

export interface TableDisplayProps extends TableHTMLAttributes<HTMLTableElement> {
  'containerProps'?: Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & { 'data-name'?: string },
  'tableHeaderProps'?: Omit<TableHeaderProps, 'children' | 'table'>,
  'virtualized'?: boolean | TableVirtualizationOptions,
  'data-name'?: string,
}


/**
 * A display component for a table that requires a TableProvider for the table context
 */
export const TableDisplay = <T,>({
  children,
  containerProps,
  tableHeaderProps,
  virtualized = false,
  ...props
}: TableDisplayProps) => {
  const { table, targetWidth, columnSizingMode } = useTableStateContext<T>()
  const { containerRef } = useTableContainerContext<T>()
  const tableRef = useRef<HTMLTableElement>(null)
  const scrollbarState = useScrollbarState({
    containerRef,
    contentRef: tableRef,
    isActive: !!virtualized,
  })

  const virtualizedScroll = typeof virtualized === 'object' ? virtualized.scroll : undefined

  return (
    <div
      {...containerProps}
      ref={containerRef}
      data-name={containerProps?.['data-name'] ?? 'table-container'}
      data-scrollbar={scrollbarState}
    >
      <table
        {...props}
        ref={tableRef}
        data-name={props['data-name'] ?? 'table'}
        data-column-sizing={columnSizingMode}

        style={{
          ...(columnSizingMode === 'fill'
            ? { width: Math.floor(Math.max(table.getTotalSize(), targetWidth ?? table.getTotalSize())) }
            : {}),
          ...props.style,
        }}
      >
        {children}
        <TableHeader
          {...tableHeaderProps}
          stickyScroll={tableHeaderProps?.stickyScroll ?? (virtualizedScroll === 'page' ? 'page' : 'container')}
        />
        {virtualized
          ? <VirtualizedTableBody {...(typeof virtualized === 'object' ? virtualized : {})} />
          : <TableBody />}
      </table>
    </div>
  )
}
