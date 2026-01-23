import { Pagination } from '@/src/components/layout/navigation/Pagination'
import { useTableBodyContext } from './TableContext'
import { useEffect } from 'react'
import { Select, type SelectProps } from '@/src/components/user-interaction/select/Select'
import { SelectOption } from '@/src/components/user-interaction/select/SelectComponents'
import { MathUtil } from '@/src/utils/math'

export const TablePagination = () => {
  const { table: table } = useTableBodyContext()

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

export interface TablePageSizeControllerProps extends SelectProps {
    pageSizeOptions?: number[],
}

export const TablePageSizeController = ({
  pageSizeOptions = defaultPageSizeOptions,
  ...props
}: TablePageSizeControllerProps) => {
  const { table: table } = useTableBodyContext()
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
