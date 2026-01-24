import { Pagination } from '@/src/components/layout/navigation/Pagination'
import { useTableDataContext } from './TableContext'
import type { HTMLAttributes } from 'react'
import { useEffect } from 'react'
import { Select, type SelectProps } from '@/src/components/user-interaction/select/Select'
import { SelectOption } from '@/src/components/user-interaction/select/SelectComponents'
import { MathUtil } from '@/src/utils/math'
import { Visibility } from '../Visibility'
import clsx from 'clsx'

export const TablePaginationMenu = () => {
  const { table: table } = useTableDataContext()

  useEffect(() => {
    const { pageIndex } = table.getState().pagination
    const pageCount = table.getPageCount()
    if(pageIndex >= pageCount || pageIndex < 0) {
      table.setPageIndex(MathUtil.clamp(pageIndex, [0, pageCount- 1]))
    }
  }, [table])

  return (
    <Pagination
      pageIndex={table.getState().pagination.pageIndex}
      pageCount={table.getPageCount()}
      onPageIndexChanged={page => table.setPageIndex(page)}
    />
  )
}


const defaultPageSizeOptions: number[] = [10, 25, 50, 100] as const

export interface TablePageSizeSelectProps extends SelectProps {
  pageSizeOptions?: number[],
}

export const TablePageSizeSelect = ({
  pageSizeOptions = defaultPageSizeOptions,
  ...props
}: TablePageSizeSelectProps) => {
  const { table: table } = useTableDataContext()
  const currentPageSize = table.getState().pagination.pageSize

  return (
    <Select
      {...props}
      value={currentPageSize.toString()}
      onValueChange={(value) => table.setPageSize(Number(value))}
    >
      {pageSizeOptions.map(size => (
        <SelectOption key={size} value={size.toString()}>
          {size}
        </SelectOption>
      ))}
    </Select>
  )
}

export interface TablePaginationProps extends HTMLAttributes<HTMLDivElement> {
  allowChangingPageSize?: boolean,
  pageSizeOptions?: number[],
}

export const TablePagination = ({ allowChangingPageSize = true, pageSizeOptions, ...props }: TablePaginationProps) => {
  return (
    <div {...props} className={clsx('flex-row-2 items-center justify-center', props.className)}>
      <div className="relative">
        <TablePaginationMenu />
        <Visibility isVisible={allowChangingPageSize}>
          <TablePageSizeSelect pageSizeOptions={pageSizeOptions} buttonProps={{ className: 'absolute left-1/1 top-1/2 -translate-y-1/2 translate-x-4 h-10 min-w-24' }} />
        </Visibility>
      </div>
    </div>
  )
}