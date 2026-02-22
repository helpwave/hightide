import { useMemo, useState, type ReactNode } from 'react'
import type { FilterValue } from './filter-function'
import { useFilterValueTranslation } from './filter-function'
import { DataTypeUtils, type DataType } from './data-types'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { PlusIcon } from 'lucide-react'
import { PopUpRoot } from '../../layout/popup/PopUpRoot'
import { PopUp } from '../../layout/popup/PopUp'
import { PopUpOpener } from '../../layout/popup/PopUpOpener'
import { Button } from '../Button'
import { FilterPopUp } from './FilterPopUp'
import { Combobox, ComboboxOption } from '../Combobox'
import { PopUpContext } from '../../layout/popup/PopUpContext'
import { ExpansionIcon } from '../../display-and-visualization/ExpansionIcon'
import { FilterOperatorUtils } from './FilterOperator'

export interface IdentifierFilterValue extends FilterValue {
  id: string,
}

export interface FilterListItem {
  id: string,
  label: string,
  display?: ReactNode,
  dataType: DataType,
  tags: ReadonlyArray<{ tag: string, label: string, display?: ReactNode }>,
}

export interface FilterListProps {
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

  return (
    <div className="flex-row-1 flex-wrap gap-y-1">
      <PopUpRoot>
        <PopUpOpener>
          {({ toggleOpen, props }) => (
            <Button {...props} onClick={toggleOpen} color="neutral" size="sm">
              {translation('addFilter')}
              <PlusIcon className="size-4" />
            </Button>
          )}
        </PopUpOpener>
        <PopUp className="flex-col-0 p-2">
          <PopUpContext.Consumer>
            {({ setIsOpen }) => (
              <Combobox onItemClick={(id) => {
                const item = itemRecord[id]
                if(!item) return
                const newValue: IdentifierFilterValue = {
                  id: item.id,
                  dataType: item.dataType,
                  operator: FilterOperatorUtils.getDefaultOperator(item.dataType),
                  parameter: {}
                }
                onValueChange([...value, newValue])
                setEditState(newValue)
                setIsOpen(false)
              }}>
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
      {value.map(filterValue => {
        const item = itemRecord[filterValue.id]
        if(!item) return null
        return (
          <PopUpRoot
            key={filterValue.id}
            isOpen={editState?.id === filterValue.id}
            onIsOpenChange={isOpen => {
              if (!isOpen) {
                onValueChange(value.map(prevItem => prevItem.id === filterValue.id ? { ...prevItem, ...(editState ?? {}) } : prevItem))
                setEditState(undefined)
              } else {
                const valueItem = value.find(prevItem => prevItem.id === filterValue.id)
                setEditState({ ...valueItem })
              }
            }}
          >
            <PopUpOpener>
              {({ toggleOpen, props, isOpen }) => (
                <Button {...props} onClick={toggleOpen} color="primary" coloringStyle="tonal" size="sm">
                  {item.label + ': ' + filterValueToLabel(filterValue, { tags: item.tags })}
                  <ExpansionIcon isExpanded={isOpen} />
                </Button>
              )}
            </PopUpOpener>
            <FilterPopUp
              name={item.label}
              value={editState?.id === filterValue.id ? editState : filterValue}
              dataType={item.dataType}
              tags={item.tags}
              onValueChange={value => setEditState({ ...filterValue, ...value })}
              onRemove={() => onValueChange(value.filter(prevItem => prevItem.id !== filterValue.id))}
            />
          </PopUpRoot>
        )
      })}
    </div>
  )
}