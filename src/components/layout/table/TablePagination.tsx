import { Pagination } from '@/src/components/layout/navigation/Pagination'
import { useTableContext } from './TableContext'
import { useEffect } from 'react'
import { Select, type SelectProps } from '@/src/components/user-interaction/select/Select'
import { SelectOption } from '@/src/components/user-interaction/select/SelectComponents'
import type { TooltipProps } from '@/src/components/user-interaction/Tooltip'
import { Tooltip } from '@/src/components/user-interaction/Tooltip'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { MathUtil } from '@/src/utils/math'

export const TablePagination = () => {
  const { tableState: table } = useTableContext()

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
  const { tableState: table } = useTableContext()
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
