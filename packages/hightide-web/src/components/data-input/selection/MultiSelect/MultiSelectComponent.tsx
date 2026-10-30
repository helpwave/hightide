import type { Ref } from 'react'
import type { MultiSelectStateManagerProps } from './MultiSelectStateManager'
import { MultiSelectStateManager } from './MultiSelectStateManager'
import type { MultiSelectTriggerProps } from './MultiSelectTrigger'
import { MultiSelectTrigger } from './MultiSelectTrigger'
import type { MultiSelectPopUpProps } from './MultiSelectPopUp'
import { MultiSelectPopUp } from './MultiSelectPopUp'
import type { MultiSelectSearchbarProps } from './MultiSelectSearchbar'
import { MultiSelectSearchbar } from './MultiSelectSearchbar'
import type { MultiSelectListProps } from './MultiSelectList'
import { MultiSelectList } from './MultiSelectList'

export type MultiSelectProps<T = string> = Omit<MultiSelectStateManagerProps<T>, 'children'> & {
  placeholder?: MultiSelectTriggerProps<T>['placeholder'],
  selectedDisplay?: MultiSelectTriggerProps<T>['selectedDisplay'],
  triggerRef?: Ref<HTMLDivElement>,
  triggerProps?: MultiSelectTriggerProps<T>,
  popupRef?: Ref<HTMLDivElement>,
  popupProps?: MultiSelectPopUpProps,
  searchbarRef?: Ref<HTMLInputElement>,
  searchbarProps?: MultiSelectSearchbarProps,
  listRef?: Ref<HTMLUListElement>,
  listProps?: MultiSelectListProps<T>,
}

export function MultiSelectComponent<T = string>({
  placeholder,
  selectedDisplay,
  triggerRef,
  triggerProps,
  popupRef,
  popupProps,
  searchbarRef,
  searchbarProps,
  listRef,
  listProps,
  ...props
}: MultiSelectProps<T>) {
  return (
    <MultiSelectStateManager<T> {...props}>
      <MultiSelectTrigger
        placeholder={placeholder}
        selectedDisplay={selectedDisplay}
        {...triggerProps}
        ref={triggerRef}
      />
      <MultiSelectPopUp
        {...popupProps}
        ref={popupRef}
      >
        <MultiSelectSearchbar
          {...searchbarProps}
          ref={searchbarRef}
        />
        <MultiSelectList
          {...listProps}
          ref={listRef}
        />
      </MultiSelectPopUp>
    </MultiSelectStateManager>
  )
}
