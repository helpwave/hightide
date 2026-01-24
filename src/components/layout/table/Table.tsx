import type { TableProviderProps } from './TableProvider'
import { TableProvider } from './TableProvider'
import type { TableDisplayProps } from './TableDisplay'
import { TableDisplay } from './TableDisplay'
import type { TablePaginationProps } from './TablePagination'
import { TablePagination } from './TablePagination'
import { Visibility } from '../Visibility'
import type { TableWithSelectionProviderProps } from './TableWithSelectionProvider'
import { TableWithSelectionProvider } from './TableWithSelectionProvider'
import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export interface TableProps<T> extends HTMLAttributes<HTMLDivElement> {
    table: TableProviderProps<T>,
    paginationOptions?: TablePaginationProps & {
        showPagination?: boolean,
    },
    displayProps?: Omit<TableDisplayProps, 'children'>,
    header?: React.ReactNode,
    footer?: React.ReactNode,
}

export const Table = <T,>({ children, table, paginationOptions, displayProps, header, footer, ...props }: TableProps<T>) => {
  const { showPagination = true, allowChangingPageSize, pageSizeOptions } = paginationOptions ?? {}
  return (
    <div {...props} className={clsx('flex-col-3', props.className)}>
      <TableProvider {...table} >
        {header}
        <TableDisplay {...displayProps}>{children}</TableDisplay>
        <Visibility isVisible={showPagination}>
          <TablePagination allowChangingPageSize={allowChangingPageSize} pageSizeOptions={pageSizeOptions} />
        </Visibility>
        {footer}
      </TableProvider>
    </div>
  )
}

export interface TableWithSelectionProps<T> extends HTMLAttributes<HTMLDivElement> {
    table: TableWithSelectionProviderProps<T>,
    paginationOptions?: TablePaginationProps & {
        showPagination?: boolean,
    },
    displayProps?: Omit<TableDisplayProps, 'children'>,
    header?: React.ReactNode,
    footer?: React.ReactNode,
}

export const TableWithSelection = <T,>({
  children,
  table,
  paginationOptions,
  displayProps,
  header,
  footer,
  ...props
}: TableWithSelectionProps<T>) => {
  const { showPagination = true, allowChangingPageSize, pageSizeOptions } = paginationOptions ?? {}

  return (
    <div {...props} className={clsx('flex-col-3', props.className)}>
      <TableWithSelectionProvider {...table}>
        {header}
        <TableDisplay {...displayProps}>{children}</TableDisplay>
        <Visibility isVisible={showPagination}>
          <TablePagination allowChangingPageSize={allowChangingPageSize} pageSizeOptions={pageSizeOptions} />
        </Visibility>
        {footer}
      </TableWithSelectionProvider>
    </div>
  )
}