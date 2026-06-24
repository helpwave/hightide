import type { TableHTMLAttributes } from 'react'
import './types'
import { TableBody } from './TableBody'
import type { TableHeaderProps } from './TableHeader'
import { TableHeader } from './TableHeader'
import { useTableContainerContext, useTableStateContext } from './TableContext'
import type { TableVirtualizationOptions } from './VirtualizedTableBody'
import { VirtualizedTableBody } from './VirtualizedTableBody'

export interface TableDisplayProps extends TableHTMLAttributes<HTMLTableElement> {
  containerProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
  tableHeaderProps?: Omit<TableHeaderProps, 'children' | 'table'>,
  /**
   * Opt into row virtualization (windowing): only the rows in (or near) the viewport are mounted to
   * the DOM, so very large lists stay responsive. Pass `true` for the defaults or an options object
   * to tune it (see {@link TableVirtualizationOptions}). Defaults to window-scroll, which drops into
   * page-scrolled / infinite-scroll layouts without any change.
   *
   * Filler rows are ignored while virtualized (the reserved scroll height already fills the table),
   * so `isUsingFillerRows` has no effect in this mode. Defaults to `false` (unchanged behaviour).
   */
  virtualized?: boolean | TableVirtualizationOptions,
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
  const { table } = useTableStateContext<T>()
  const { containerRef } = useTableContainerContext<T>()

  return (
    <div {...containerProps} ref={containerRef} data-name={containerProps?.['data-name'] ?? 'table-container'}>
      <table
        {...props}
        data-name={props['data-name'] ?? 'table'}

        style={{
          width: Math.floor(Math.max(table.getTotalSize(), containerRef.current?.offsetWidth ?? table.getTotalSize())),
          ...props.style,
        }}
      >
        {children}
        <TableHeader {...tableHeaderProps} />
        {virtualized
          ? <VirtualizedTableBody {...(typeof virtualized === 'object' ? virtualized : {})} />
          : <TableBody />}
      </table>
    </div>
  )
}