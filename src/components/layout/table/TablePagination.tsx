import { Pagination } from '../navigation'
import { useTableContext } from './TableContext'
import { useEffect } from 'react'
import type { SelectProps } from '@/src/components/user-interaction/select'
import { Select, SelectOption } from '@/src/components/user-interaction/select'
import type { TooltipProps } from '@/src/components/user-interaction/Tooltip'
import { Tooltip } from '@/src/components/user-interaction/Tooltip'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { MathUtil } from '@/src/utils'

export const TablePagination = () => {
  const { table } = useTableContext()

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
    tooltipProps?: Omit<TooltipProps, 'children' | 'tooltip'>,
}

export const TablePageSizeController = ({
  pageSizeOptions = defaultPageSizeOptions,
  tooltipProps,
  ...props
}: TablePageSizeControllerProps) => {
  const { table } = useTableContext()
  const translation = useHightideTranslation()
  const currentPageSize = table.getState().pagination.pageSize

  return (
    <Tooltip tooltip={translation('entriesPerPage')} {...tooltipProps} position="top">
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
    </Tooltip>
  )
}
