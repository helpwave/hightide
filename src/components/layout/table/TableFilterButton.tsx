import { FilterIcon } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { Header } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { Visibility } from '../Visibility'
import { IconButton } from '../../user-interaction/IconButton'
import type { DataType } from '../../user-interaction/data/data-types'
import type { FilterValue } from '../../user-interaction/data/filter-function'
import { FilterPopUp } from '../../user-interaction/data/FilterPopUp'

export type TableFilterButtonProps = {
  filterType: DataType,
  header: Header<unknown, unknown>,
}

export const TableFilterButton = ({
  filterType,
  header,
}: TableFilterButtonProps) => {
  const translation = useHightideTranslation()
  const column = header.column
  const columnFilterValue = column.getFilterValue()
  const [filterValue, setFilterValue] = useState<FilterValue | undefined>(columnFilterValue as FilterValue | undefined)
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
    setFilterValue(columnFilterValue as FilterValue)
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
        tooltip={translation(filterValue ? 'editFilter' : 'addFilter')}
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
      <FilterPopUp
        ref={containerRef}
        id={ids.popup}
        isOpen={isOpen}
        options={{
          verticalAlignment: 'afterEnd',
          horizontalAlignment: 'center',
        }}
        anchor={anchorRef}

        onValueChange={setFilterValue}
        onRemove={() => {
          column.setFilterValue(undefined)
          setIsOpen(false)
        }}
        onClose={() => {
          column.setFilterValue(filterValue)
          setIsOpen(false)
        }}

        className="flex-col-2 px-3 py-2 items-start"
        dataType={filterType}
        value={filterValue}

        name={flexRender(column.columnDef.header, header.getContext())}

        tags={column.columnDef.meta?.filterData?.tags ?? []}
      />
    </>
  )
}