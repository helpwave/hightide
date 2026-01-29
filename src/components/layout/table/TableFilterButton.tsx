import { Button } from '../../user-interaction/Button'
import { FilterIcon } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { Column } from '@tanstack/react-table'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Visibility } from '../Visibility'
import { PopUp } from '../popup/PopUp'
import type { TableFilterCategory, TableFilterValue } from './TableFilter'
import { TableFilterContent } from './TableFilterPopups'
import { IconButton } from '../../user-interaction/IconButton'

export type TableFilterButtonProps<T = unknown> = {
  filterType: TableFilterCategory,
  column: Column<T>,
}

export const TableFilterButton = <T, >({
  filterType,
  column,
}: TableFilterButtonProps<T>) => {
  const translation = useHightideTranslation()
  const columnFilterValue = column.getFilterValue()
  const [filterValue, setFilterValue] = useState<TableFilterValue | undefined>(columnFilterValue as TableFilterValue)
  const hasFilter = !!filterValue
  const anchorRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const id = useId()
  const ids = useMemo(() => ({
    button: `table-filter-button-${id}`,
    popup: `table-filter-popup-${id}`,
    label: `table-filter-label-${id}`,
  }), [id])

  useEffect(() => {
    setFilterValue(columnFilterValue as TableFilterValue)
  }, [columnFilterValue])

  const isTagsFilter = filterType === 'multiTags' || filterType === 'singleTag'
  const hasTagsMetaData = column.columnDef.meta?.filterData?.tags?.length && column.columnDef.meta.filterData.tags.length > 0
  if (isTagsFilter && !hasTagsMetaData) {
    return null
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        id={ids.button}
        tooltip={translation('filter')}
        color="neutral"
        size="xs"

        onClick={() => setIsOpen(!isOpen)}

        role="combobox"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? ids.popup : undefined}
        aria-labelledby={ids.label}

        className="relative"
      >
        <FilterIcon className="size-4"/>
        <Visibility isVisible={hasFilter}>
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
        </Visibility>
      </IconButton>
      <PopUp
        ref={containerRef}
        id={ids.popup}
        isOpen={isOpen}
        options={{
          verticalAlignment: 'afterEnd',
          horizontalAlignment: 'center',
        }}
        anchor={anchorRef}

        onClose={() => setIsOpen(false)}

        role="dialog"
        aria-labelledby={ids.label}

        className="flex-col-2 p-2 items-start"
      >
        <span id={ids.label} className="typography-label-lg font-semibold">{translation('filter')}</span>
        <TableFilterContent
          columnId={column.id}
          filterType={filterType}
          filterValue={filterValue}
          onFilterValueChange={setFilterValue}
        />
        <div className="flex-row-2 justify-end w-full">
          {hasFilter && (
            <Button color="negative" size="sm" onClick={() => {
              column.setFilterValue(undefined)
              setIsOpen(false)
            }}>
              {translation('remove')}
            </Button>
          )}
          <Button size="sm" onClick={() => {
            if (filterValue) {
              column.setFilterValue(filterValue)
            }
            setIsOpen(false)
          }}>
            {translation('apply')}
          </Button>
        </div>
      </PopUp>
    </>
  )
}