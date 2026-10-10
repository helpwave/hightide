import { useMemo } from 'react'
import type { ColumnSort } from '@tanstack/react-table'
import { DataTypeUtils, type DataType } from './data-types'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { ArrowDownWideNarrow, ArrowUpNarrowWide, PlusIcon, TrashIcon, XIcon } from 'lucide-react'
import { PopUpRoot } from '../../layout/PopUp/PopUpRoot'
import { PopUp } from '../../layout/PopUp/PopUp'
import { PopUpOpener } from '../../layout/PopUp/PopUpOpener'
import { Icon } from '../../visualization/Icon'
import { Button } from '../Button'
import { Pressable } from '../Pressable'
import { Combobox } from '../../data-input/Combobox/Combobox'
import { PopUpContext } from '../../layout/PopUp/PopUpContext'
import { IconButton } from '../IconButton'
import clsx from 'clsx'

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
      <PopUpRoot>
        <PopUpOpener>
          {({ toggleOpen, props }) => (
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
        </PopUpOpener>
        <PopUp className="flex-col-2 p-2">
          <PopUpContext.Consumer>
            {(context) => {
              if(!context) return
              const { setIsOpen } = context
              return (
                <Combobox
                  onItemClick={(id) => {
                    const item = itemRecord[id]
                    if (!item) return
                    onSortingChange([...sorting, { id: item.id, desc: false }])
                    setIsOpen(false)
                  }}
                >
                  {inactiveItems.map((item) => (
                    <Combobox.Option key={item.id} value={item.id} label={item.label}>
                      {DataTypeUtils.toIcon(item.dataType)}
                      {item.label}
                    </Combobox.Option>
                  ))}
                </Combobox>
              )}}
          </PopUpContext.Consumer>
        </PopUp>
      </PopUpRoot>
      {sorting.map((columnSort) => {
        const item = itemRecord[columnSort.id]
        if (!item) return null
        return (
          <PopUpRoot key={columnSort.id}>
            <PopUpOpener>
              {({ toggleOpen, props }) => (
                <Pressable {...props} onClick={toggleOpen} color="secondary" coloringStyle="filled" colorVariant="tonal" bordered size="sm">
                  <span className="font-bold">{item.label}</span>
                  <Icon icon={columnSort.desc ? ArrowDownWideNarrow : ArrowUpNarrowWide} size="sm" />
                </Pressable>
              )}
            </PopUpOpener>
            <PopUpContext.Consumer>
              {(context) => {
                if(!context) return
                const { setIsOpen } = context
                return (
                  <PopUp
                    className={clsx('flex-col-3 p-3 min-w-64')}
                    onClose={() => setIsOpen(false)}
                  >
                    <div className="flex-row-4 justify-between w-full items-center gap-2">
                      <span className="typography-title-sm font-semibold">{item.label}</span>
                      <div className="flex-row-0 shrink-0 items-center">
                        <IconButton
                          tooltip={translation('removeFilter')}
                          onClick={() => {
                            removeSort(columnSort.id)
                            setIsOpen(false)
                          }}
                          color="negative"
                          variant="foreground"
                          size="sm"
                          icon={TrashIcon}
                        />
                        <IconButton
                          tooltip={translation('close')}
                          onClick={() => setIsOpen(false)}
                          color="neutral"
                          variant="foreground"
                          size="sm"
                          icon={XIcon}
                        />
                      </div>
                    </div>
                    <div className="flex-row-1 w-full gap-2">
                      <Button
                        type="button"
                        className="flex-1"
                        color={columnSort.desc ? 'neutral' : 'primary'}
                        variant="filled"
                        size="md"
                        onClick={() => setSortDirection(columnSort.id, false)}
                        leading={ArrowUpNarrowWide}
                      >
                        {translation('sortAsc')}
                      </Button>
                      <Button
                        type="button"
                        className="flex-1"
                        color={columnSort.desc ? 'primary' : 'neutral'}
                        variant="filled"
                        size="md"
                        onClick={() => setSortDirection(columnSort.id, true)}
                        leading={ArrowDownWideNarrow}
                      >
                        {translation('sortDesc')}
                      </Button>
                    </div>
                  </PopUp>
                )}}
            </PopUpContext.Consumer>
          </PopUpRoot>
        )
      })}
    </div>
  )
}
