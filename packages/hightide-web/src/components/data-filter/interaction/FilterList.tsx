import type { PropsWithChildren } from 'react'
import { useId, useMemo, useState, type ReactNode } from 'react'
import { useStateStore, useStateStoreBindings, type StateStoreBindingChange } from '@helpwave/hightide-utils/hooks'
import type { FilterValue } from '../filter-functions'
import { FilterValueUtils, useFilterValueTranslation } from '../filter-functions'
import { DataTypeUtils, type DataType } from '../data-types'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { PlusIcon } from 'lucide-react'
import { PopUp } from '../../layout/PopUp/PopUp'
import type { PopUpOpenerProps } from '../../layout/PopUp/PopUpOpener'
import type { PopUpState } from '../../layout/PopUp/PopUpState'
import { Button } from '../../interaction/Button'
import { Pressable } from '../../interaction/Pressable'
import { FilterPopUp } from './FilterPopUp'
import { Combobox } from '../../data-input/selection/Combobox/Combobox'
import type { FilterOperator } from '../filter-operator'
import { FilterOperatorUtils } from '../filter-operator'
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

function FilterValuePopUp({
  isOpen,
  onIsOpenChange,
  trigger,
  children,
}: {
  isOpen?: boolean,
  onIsOpenChange?: (isOpen: boolean) => void | StateStoreBindingChange<boolean>,
  trigger: PopUpOpenerProps<HTMLButtonElement>['children'],
  children: ReactNode,
}) {
  const store = useStateStore<PopUpState>({ isOpen: isOpen ?? false })
  const onStateChange = useStateStoreBindings({
    store,
    bindings: {
      isOpen: {
        value: isOpen,
        onValueChange: (next) => onIsOpenChange?.(next),
      },
    },
  })

  return (
    <PopUp.StateManager state={store} onStateChange={onStateChange}>
      <PopUp.Opener<HTMLButtonElement>>
        {trigger}
      </PopUp.Opener>
      {children}
    </PopUp.StateManager>
  )
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
  const addFilterTitleId = useId()

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
            {translation('addFilter')}
          </Button>
        )}
        panelProps={{
          'className': 'flex-col-0 min-w-72',
          'aria-labelledby': addFilterTitleId,
        }}
      >
        <span id={addFilterTitleId} className="typography-title-md font-semibold px-3 pt-3 pb-2">
          {translation('addFilter')}
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
                    const newValue: IdentifierFilterValue = {
                      id: item.id,
                      value: {
                        dataType: item.dataType,
                        operator: FilterOperatorUtils.getDefaultOperator(item.dataType),
                        parameter: {}
                      },
                    }
                    setEditState(newValue)
                    dispatch({ type: 'close' })
                  }}
                  options={inactiveItems.map(item => ({
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
      {valueWithEditState.map(columnFilter => {
        const item = itemRecord[columnFilter.id]
        if (!item) return null
        return (
          <FilterValuePopUp
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
            trigger={({ toggleOpen, props }) => (
              <Pressable {...props} onClick={toggleOpen} color="primary" coloringStyle="filled" colorVariant="tonal" size="sm" className="list-chip">
                {item.activeLabelBuilder ?
                  item.activeLabelBuilder(columnFilter.value) : (
                    <>
                      <span className="font-bold">{item.label}</span>
                      {filterValueToLabel(columnFilter.value, { tags: item.tags })}
                    </>
                  )
                }
              </Pressable>
            )}
          >
            <PopUp.Consumer>
              {(context) => {
                if(!context) return
                const { state, dispatch } = context
                const isOpen = state.isOpen
                const close = () => dispatch({ type: 'close' })
                return item.popUpBuilder ? (
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
                    onClose: close,
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
                    onClose={close}
                  />
                )}}
            </PopUp.Consumer>
          </FilterValuePopUp>
        )
      })}
    </div>
  )
}