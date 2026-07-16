import type { PropsWithChildren } from 'react'
import { useMemo, useState, type ReactNode } from 'react'
import type { FilterValue } from './filter-function'
import { FilterValueUtils, useFilterValueTranslation } from './filter-function'
import { DataTypeUtils, type DataType } from './data-types'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { PlusIcon } from 'lucide-react'
import { PopUpRoot } from '../../layout/popup/PopUpRoot'
import { PopUp } from '../../layout/popup/PopUp'
import { PopUpOpener } from '../../layout/popup/PopUpOpener'
import { Button } from '../Button'
import { FilterPopUp } from './FilterPopUp'
import { Combobox } from '@/src/components/user-interaction/Combobox/Combobox'
import { ComboboxOption } from '@/src/components/user-interaction/Combobox/ComboboxOption'
import { PopUpContext } from '../../layout/popup/PopUpContext'
import type { FilterOperator } from './FilterOperator'
import { FilterOperatorUtils } from './FilterOperator'
import type { ColumnFilter } from '@tanstack/react-table'

export interface IdentifierFilterValue extends ColumnFilter {
  value: FilterValue,
}

export interface FilterListPopUpBuilderProps {
  value: FilterValue,
  onValueChange: (value: FilterValue) => void,
  onRemove: () => void,
  operatorOverrides?: FilterOperator[],
  dataType: DataType,
  tags: ReadonlyArray<{ tag: string, label: string, display?: ReactNode }>,
  name: string,
  isOpen: boolean,
  onClose: () => void,
}

export interface FilterListItem {
  id: string,
  label: string,
  dataType: DataType,
  tags: ReadonlyArray<{ tag: string, label: string, display?: ReactNode }>,
  operatorOverrides?: FilterOperator[],
  popUpBuilder?: (props: FilterListPopUpBuilderProps) => ReactNode,
  activeLabelBuilder?: (value: FilterValue) => ReactNode,
}

export interface FilterListProps extends PropsWithChildren {
  value: IdentifierFilterValue[],
  onValueChange: (value: IdentifierFilterValue[]) => void,
  availableItems: FilterListItem[],
}

export const FilterList = ({ value, onValueChange, availableItems }: FilterListProps) => {
  const translation = useHightideTranslation()
  const filterValueToLabel = useFilterValueTranslation()
  const activeIds = useMemo(() => value.map((item) => item.id), [value])
  const inactiveItems = useMemo(() => availableItems.filter((item) => !activeIds.includes(item.id)).sort((a, b) => a.label.localeCompare(b.label)), [availableItems, activeIds])
  const itemRecord = useMemo(() => availableItems.reduce((acc, item) => {
    acc[item.id] = item
    return acc
  }, {} as Record<string, FilterListItem>), [availableItems])
  const [editState, setEditState] = useState<IdentifierFilterValue | undefined>(undefined)

  const valueWithEditState = useMemo(() => {
    let foundEditValue = false
    for (const item of value) {
      if (item.id === editState?.id) {
        foundEditValue = true
        break
      }
    }
    if (!foundEditValue && editState) {
      return [...value, editState]
    }
    return value
  }, [value, editState])

  return (
    <div className="flex-row-2 flex-wrap gap-y-2">
      <PopUpRoot>
        <PopUpOpener>
          {({ toggleOpen, props }) => (
            <Button {...props} onClick={toggleOpen} color="neutral" size="sm" className="min-w-36">
              {translation('addFilter')}
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
                  const newValue: IdentifierFilterValue = {
                    id: item.id,
                    value: {
                      dataType: item.dataType,
                      operator: FilterOperatorUtils.getDefaultOperator(item.dataType),
                      parameter: {}
                    },
                  }
                  setEditState(newValue)
                  setIsOpen(false)
                }}
              >
                {inactiveItems.map(item => (
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
      {valueWithEditState.map(columnFilter => {
        const item = itemRecord[columnFilter.id]
        if (!item) return null
        return (
          <PopUpRoot
            key={columnFilter.id}
            isOpen={editState?.id === columnFilter.id}
            onIsOpenChange={isOpen => {
              if (!isOpen) {
                const isEditStateValid = editState ? FilterValueUtils.isValid(editState.value) : false
                if (isEditStateValid) {
                  onValueChange(valueWithEditState.map(prevItem => prevItem.id === columnFilter.id ? { ...prevItem, ...editState } : prevItem))
                }
                setEditState(undefined)
              } else {
                const valueItem = value.find(prevItem => prevItem.id === columnFilter.id)
                if (!valueItem) return
                setEditState({ ...valueItem })
              }
            }}
          >
            <PopUpOpener>
              {({ toggleOpen, props }) => (
                <Button {...props} onClick={toggleOpen} color="primary" coloringStyle="tonal-outline" size="sm">
                  {item.activeLabelBuilder ?
                    item.activeLabelBuilder(columnFilter.value) : (
                      <>
                        <span className="font-bold">{item.label}</span>
                        {filterValueToLabel(columnFilter.value, { tags: item.tags })}
                      </>
                    )
                  }
                </Button>
              )}
            </PopUpOpener>
            <PopUpContext.Consumer>
              {({ isOpen, setIsOpen }) => item.popUpBuilder ? (
                item.popUpBuilder({
                  value: editState?.id === columnFilter.id ? editState.value : columnFilter.value,
                  onValueChange: value => setEditState({ ...columnFilter, value }),
                  onRemove: () => {
                    onValueChange(value.filter(prevItem => prevItem.id !== columnFilter.id))
                    setEditState(undefined)
                  },
                  operatorOverrides: item.operatorOverrides,
                  dataType: item.dataType,
                  tags: item.tags,
                  name: item.label,
                  isOpen,
                  onClose: () => setIsOpen(false),
                })
              ) : (
                <FilterPopUp
                  name={item.label}
                  value={editState?.id === columnFilter.id ? editState.value : columnFilter.value}
                  dataType={item.dataType}
                  tags={item.tags}
                  operatorOverrides={item.operatorOverrides}
                  onValueChange={value => {
                    setEditState({ ...columnFilter, value })
                  }}
                  onRemove={() => {
                    onValueChange(value.filter(prevItem => prevItem.id !== columnFilter.id))
                    setEditState(undefined)
                  }}
                  onClose={() => setIsOpen(false)}
                />
              )}
            </PopUpContext.Consumer>
          </PopUpRoot>
        )
      })}
    </div>
  )
}