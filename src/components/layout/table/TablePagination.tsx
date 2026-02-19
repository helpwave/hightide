import { Pagination, type PaginationProps } from '@/src/components/layout/navigation/Pagination'
import type { HTMLAttributes } from 'react'
import { Select, type SelectProps } from '@/src/components/user-interaction/select/Select'
import { SelectOption } from '@/src/components/user-interaction/select/SelectComponents'
import { Visibility } from '../Visibility'
import clsx from 'clsx'
import { useTableStateWithoutSizingContext } from './TableContext'

export type TablePaginationMenuProps = Omit<PaginationProps, 'pageIndex' | 'pageCount'>

export const TablePaginationMenu = ({ ...props }: TablePaginationMenuProps) => {
  const { table } = useTableStateWithoutSizingContext()

  return (
    <Pagination
      {...props}
      pageIndex={table.getState().pagination.pageIndex}
      pageCount={table.getPageCount()}
      onPageIndexChanged={page => {
        table.setPageIndex(page)
        props.onPageIndexChanged?.(page)
      }}
    />
  )
}


const defaultPageSizeOptions: number[] = [10, 25, 50, 100, 500, 1000] as const

export interface TablePageSizeSelectProps extends SelectProps {
  pageSizeOptions?: number[],
}

export const TablePageSizeSelect = ({
  pageSizeOptions = defaultPageSizeOptions,
  ...props
}: TablePageSizeSelectProps) => {
  const { table } = useTableStateWithoutSizingContext()
  const currentPageSize = table.getState().pagination.pageSize

  return (
    <Select
      {...props}
      value={currentPageSize.toString()}
      onValueChange={(value) => table.setPageSize(Number(value))}
    >
      {pageSizeOptions.map(size => (
        <SelectOption key={size} value={size.toString()} label={size.toString()}/>
      ))}
    </Select>
  )
}

export interface TablePaginationProps extends HTMLAttributes<HTMLDivElement> {
  allowChangingPageSize?: boolean,
  pageSizeOptions?: number[],
}

// TODO consider screens less than 450 px
export const TablePagination = ({ allowChangingPageSize = true, pageSizeOptions, ...props }: TablePaginationProps) => {
  return (
    <div {...props} className={clsx('container flex-col-2 sm:flex-row-8 items-center justify-center', props.className)}>
      <TablePaginationMenu />
      <Visibility isVisible={allowChangingPageSize}>
        <TablePageSizeSelect pageSizeOptions={pageSizeOptions} buttonProps={{ className: 'h-10 min-w-24 max-w-24' }} />
      </Visibility>
    </div>
  )
}