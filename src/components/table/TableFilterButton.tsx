import { Button } from '../user-action/Button'
import { Input } from '../user-action/input/Input'
import { FilterIcon } from 'lucide-react'
import { Menu } from '../user-action/Menu'
import { useEffect, useState } from 'react'
import type { Column } from '@tanstack/react-table'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'

export type TableFilterType = 'text' | 'range' | 'dateRange'

export type TableFilterButtonProps<T = unknown> = {
  filterType: TableFilterType,
  column: Column<T>,
}

export const TableFilterButton = <T, >({
                                         filterType,
                                         column,
                                       }: TableFilterButtonProps<T>) => {
  const translation = useHightideTranslation()
  const columnFilterValue = column.getFilterValue()
  const [filterValue, setFilterValue] = useState<unknown>(columnFilterValue)
  const hasFilter = !!filterValue

  useEffect(() => {
    setFilterValue(columnFilterValue)
  }, [columnFilterValue])

  return (
    <Menu<HTMLDivElement>
      trigger={({ toggleOpen }, ref) => (
        <div ref={ref} className="relative">
          <Button
            layout="icon"
            color="neutral"
            size="xs"
            onClick={toggleOpen}
          >
            <FilterIcon className="size-4"/>
          </Button>
          {hasFilter && (
            <div
              className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-primary pointer-events-none"
              aria-hidden={true}
            />
          )}
        </div>
      )}
    >
      {({ close }) => (
        <div className="flex-col-1 p-2 items-start font-normal text-menu-text">
          <h4 className="typography-label-md-semibold">{translation('filter')}</h4>
          {filterType === 'text' && (
            <Input
              value={(filterValue ?? '') as string}
              autoFocus={true}
              placeholder={translation('text')+'...'}
              onChangeText={setFilterValue}
              className="h-10"
            />
          )}
          {filterType === 'range' && (
            <div className="flex-row-2 items-center">
              <Input
                value={(filterValue as [number, number])?.[0] ?? ''}
                type="number"
                placeholder={translation('min')}
                onChangeText={text => {
                  const num = Number(text)
                  setFilterValue((old: [number, number]) => [num, old?.[1]])
                }}
                className="h-10 input-indicator-hidden w-40"
              />
              <span className="font-bold">-</span>
              <Input
                value={(filterValue as [number, number])?.[1] ?? ''}
                type="number"
                placeholder={translation('max')}
                onChangeText={text => {
                  const num = Number(text)
                  setFilterValue((old: [number, number]) => [old?.[0], num])
                }}
                className="h-10 input-indicator-hidden w-40"
              />
            </div>
          )}
          {filterType === 'dateRange' && (
            <>
              <Input
                value={(filterValue as [Date, Date])?.[0] ? (filterValue as [Date, Date])?.[0].toISOString().slice(0, 16) : ''}
                type="datetime-local"
                placeholder={translation('startDate')}
                onChangeText={text => {
                  const value = new Date(text)
                  setFilterValue((old: [Date, Date]) => [value, old?.[1]])
                }}
                className="h-10 w-50"
              />
              <Input
                value={(filterValue as [Date, Date])?.[1] ? (filterValue as [Date, Date])?.[1].toISOString().slice(0, 16) : ''}
                type="datetime-local"
                placeholder={translation('endDate')}
                onChangeText={text => {
                  const value = new Date(text)
                  setFilterValue((old: [Date, Date]) => [old?.[0], value])
                }}
                className="h-10 w-50"
              />
            </>
          )}
          <div className="flex-row-2 justify-end w-full">
            {hasFilter && (
              <Button color="negative" size="sm" onClick={() => {
                column.setFilterValue(undefined)
                close()
              }}>
                {translation('remove')}
              </Button>
            )}
            <Button size="sm" onClick={() => {
              column.setFilterValue(filterValue)
              close()
            }}>
              {translation('apply')}
            </Button>
          </div>
        </div>
      )}
    </Menu>
  )
}