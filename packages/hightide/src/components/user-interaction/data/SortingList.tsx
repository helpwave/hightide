import { useMemo } from 'react'
import type { ColumnSort } from '@tanstack/react-table'
import { DataTypeUtils, type DataType } from './data-types'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { ArrowDownWideNarrow, ArrowUpNarrowWide, PlusIcon, TrashIcon, XIcon } from 'lucide-react'
import { PopUpRoot } from '../../layout/popup/PopUpRoot'
import { PopUp } from '../../layout/popup/PopUp'
import { PopUpOpener } from '../../layout/popup/PopUpOpener'
import { Button } from '../Button'
import { Combobox } from '@/src/components/user-interaction/Combobox/Combobox'
import { ComboboxOption } from '@/src/components/user-interaction/Combobox/ComboboxOption'
import { PopUpContext } from '../../layout/popup/PopUpContext'
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
            <Button {...props} onClick={toggleOpen} color="neutral" size="sm" className="min-w-36">
              {translation('addSorting')}
              <PlusIcon className="size-4" />
            </Button>
          )}
        </PopUpOpener>
        <PopUp className="flex-col-2 p-2">
          <PopUpContext.Consumer>
            {({ setIsOpen }) => (
              <Combobox
                onItemClick={(id) => {
                  const item = itemRecord[id]
                  if (!item) return
                  onSortingChange([...sorting, { id: item.id, desc: false }])
                  setIsOpen(false)
                }}
              >
                {inactiveItems.map((item) => (
                  <ComboboxOption key={item.id} value={item.id} label={item.label}>
                    {DataTypeUtils.toIcon(item.dataType)}
                    {item.label}
                  </ComboboxOption>
                ))}
              </Combobox>
            )}
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
                <Button {...props} onClick={toggleOpen} color="secondary" coloringStyle="tonal-outline" size="sm">
                  <span className="font-bold">{item.label}</span>
                  {columnSort.desc ? <ArrowDownWideNarrow className="size-5"/> : <ArrowUpNarrowWide className="size-5"/>}
                </Button>
              )}
            </PopUpOpener>
            <PopUpContext.Consumer>
              {({ setIsOpen }) => (
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
                        coloringStyle="text"
                        size="sm"
                      >
                        <TrashIcon className="size-4" />
                      </IconButton>
                      <IconButton
                        tooltip={translation('close')}
                        onClick={() => setIsOpen(false)}
                        color="neutral"
                        coloringStyle="text"
                        size="sm"
                      >
                        <XIcon className="size-4" />
                      </IconButton>
                    </div>
                  </div>
                  <div className="flex-row-1 w-full gap-2">
                    <Button
                      type="button"
                      className="flex-1 flex-row-1 items-center justify-center gap-2"
                      color={columnSort.desc ? 'neutral' : 'primary'}
                      coloringStyle="solid"
                      size="md"
                      onClick={() => setSortDirection(columnSort.id, false)}
                    >
                      <ArrowUpNarrowWide className="size-4" />
                      {translation('sortAsc')}
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 flex-row-1 items-center justify-center gap-2"
                      color={columnSort.desc ? 'primary' : 'neutral'}
                      coloringStyle="solid"
                      size="md"
                      onClick={() => setSortDirection(columnSort.id, true)}
                    >
                      <ArrowDownWideNarrow className="size-4" />
                      {translation('sortDesc')}
                    </Button>
                  </div>
                </PopUp>
              )}
            </PopUpContext.Consumer>
          </PopUpRoot>
        )
      })}
    </div>
  )
}
