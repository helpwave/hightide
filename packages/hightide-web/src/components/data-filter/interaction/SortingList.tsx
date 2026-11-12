import { useId, useMemo } from 'react'
import type { ColumnSort } from '@tanstack/react-table'
import { DataTypeUtils, type DataType } from '../data-types'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { ArrowDownWideNarrow, ArrowUpNarrowWide, PlusIcon, XIcon } from 'lucide-react'
import { PopUp } from '../../layout/PopUp/PopUp'
import { Icon } from '../../visualization/Icon'
import { Button } from '../../interaction/Button'
import { Pressable } from '../../interaction/Pressable'
import { Combobox } from '../../data-input/selection/Combobox/Combobox'
import { IconButton } from '../../interaction/IconButton'

export interface SortingListItem {
  id: string,
  label: string,
  dataType: DataType,
}

export interface SortingListProps {
  sorting: ColumnSort[],
  onSortingChange: (sorting: ColumnSort[]) => void,
  availableItems: SortingListItem[],
}

export const SortingList = ({ sorting, onSortingChange, availableItems }: SortingListProps) => {
  const translation = useHightideTranslation()
  const addSortingTitleId = useId()
  const activeIds = useMemo(() => sorting.map((item) => item.id), [sorting])
  const inactiveItems = useMemo(
    () =>
      availableItems.filter((item) => !activeIds.includes(item.id)).sort((a, b) => a.label.localeCompare(b.label)),
    [availableItems, activeIds]
  )
  const itemRecord = useMemo(
    () =>
      availableItems.reduce(
        (acc, item) => {
          acc[item.id] = item
          return acc
        },
        {} as Record<string, SortingListItem>
      ),
    [availableItems]
  )

  const setSortDirection = (columnId: string, desc: boolean) => {
    onSortingChange(sorting.map((s) => (s.id === columnId ? { ...s, desc } : s)))
  }

  const removeSort = (columnId: string) => {
    onSortingChange(sorting.filter((s) => s.id !== columnId))
  }

  return (
    <div className="flex-row-2 flex-wrap gap-y-2">
      <PopUp
        trigger={({ toggleOpen, props }) => (
          <Button
            {...props}
            onClick={toggleOpen}
            color="neutral"
            size="sm"
            className="min-w-36"
            trailing={PlusIcon}
          >
            {translation('addSorting')}
          </Button>
        )}
        panelProps={{
          'className': 'flex-col-0 min-w-72',
          'aria-labelledby': addSortingTitleId,
        }}
      >
        <span id={addSortingTitleId} className="typography-title-md font-semibold px-3 pt-3 pb-2">
          {translation('addSorting')}
        </span>
        <PopUp.Consumer>
          {(context) => {
            if(!context) return
            const { dispatch } = context
            return (
              <div className="w-full px-3 pb-3">
                <Combobox
                  isInline
                  onItemClick={(id) => {
                    const item = itemRecord[id]
                    if (!item) return
                    onSortingChange([...sorting, { id: item.id, desc: false }])
                    dispatch({ type: 'close' })
                  }}
                  options={inactiveItems.map((item) => ({
                    value: item.id,
                    label: item.label,
                    visual: {
                      content: (
                        <>
                          {DataTypeUtils.toIcon(item.dataType)}
                          {item.label}
                        </>
                      ),
                    },
                  }))}
                />
              </div>
            )}}
        </PopUp.Consumer>
      </PopUp>
      {sorting.map((columnSort) => {
        const item = itemRecord[columnSort.id]
        if (!item) return null
        return (
          <div key={columnSort.id} className="sorting-list-chip">
            <Pressable
              type="button"
              color="secondary"
              coloringStyle="filled"
              colorVariant="tonal"
              size="sm"
              className="list-chip"
              onClick={() => setSortDirection(columnSort.id, !columnSort.desc)}
            >
              <span className="font-bold">{item.label}</span>
              <Icon icon={columnSort.desc ? ArrowDownWideNarrow : ArrowUpNarrowWide} size="sm" />
            </Pressable>
            <IconButton
              type="button"
              className="sorting-list-chip-remove"
              tooltip={translation('remove')}
              variant="foreground"
              color="negative"
              size="sm"
              icon={XIcon}
              onClick={() => removeSort(columnSort.id)}
            />
          </div>
        )
      })}
    </div>
  )
}
