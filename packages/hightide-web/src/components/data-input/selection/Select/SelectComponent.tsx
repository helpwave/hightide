import type { Ref } from 'react'
import type { SelectStateManagerProps } from './SelectStateManager'
import { SelectStateManager } from './SelectStateManager'
import type { SelectTriggerProps } from './SelectTrigger'
import { SelectTrigger } from './SelectTrigger'
import type { SelectPopUpProps } from './SelectPopUp'
import { SelectPopUp } from './SelectPopUp'
import type { SelectSearchbarProps } from './SelectSearchbar'
import { SelectSearchbar } from './SelectSearchbar'
import type { SelectListProps } from './SelectList'
import { SelectList } from './SelectList'

export type SelectProps<T = string> = Omit<SelectStateManagerProps<T>, 'children'> & {
  placeholder?: SelectTriggerProps<T>['placeholder'],
  selectedDisplay?: SelectTriggerProps<T>['selectedDisplay'],
  triggerRef?: Ref<HTMLDivElement>,
  triggerProps?: SelectTriggerProps<T>,
  popupRef?: Ref<HTMLDivElement>,
  popupProps?: SelectPopUpProps,
  searchbarRef?: Ref<HTMLInputElement>,
  searchbarProps?: SelectSearchbarProps,
  listRef?: Ref<HTMLUListElement>,
  listProps?: SelectListProps<T>,
}

export function SelectComponent<T = string>({
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
}: SelectProps<T>) {
  return (
    <SelectStateManager<T> {...props}>
      <SelectTrigger
        placeholder={placeholder}
        selectedDisplay={selectedDisplay}
        {...triggerProps}
        ref={triggerRef}
      />
      <SelectPopUp
        {...popupProps}
        ref={popupRef}
      >
        <SelectSearchbar
          {...searchbarProps}
          ref={searchbarRef}
        />
        <SelectList
          {...listProps}
          ref={listRef}
        />
      </SelectPopUp>
    </SelectStateManager>
  )
}
