import type { Ref } from 'react'
import type { ComboboxSearchbarProps } from './ComboboxSearchbar'
import { ComboboxSearchbar } from './ComboboxSearchbar'
import type { ComboboxListProps } from './ComboboxList'
import { ComboboxList } from './ComboboxList'
import type { ComboboxPopUpProps } from './ComboboxPopUp'
import { ComboboxPopUp } from './ComboboxPopUp'
import type { ComboboxStateManagerProps } from './ComboboxStateManager'
import { ComboboxStateManager } from './ComboboxStateManager'

export type ComboboxProps<T = string> = Omit<ComboboxStateManagerProps<T>, 'children'> & {
  searchbarRef?: Ref<HTMLInputElement>,
  popupRef?: Ref<HTMLDivElement>,
  listRef?: Ref<HTMLUListElement>,
  searchbarProps?: ComboboxSearchbarProps,
  popupProps?: ComboboxPopUpProps,
  listProps?: Omit<ComboboxListProps<T>, 'children'>,
}

export function ComboboxComponent<T = string>({
  searchbarRef,
  popupRef,
  listRef,
  searchbarProps,
  popupProps,
  listProps,
  ...props
}: ComboboxProps<T>) {
  return (
    <ComboboxStateManager<T> {...props}>
      <ComboboxSearchbar
        {...searchbarProps}
        ref={searchbarRef}
      />
      <ComboboxPopUp
        {...popupProps}
        ref={popupRef}
      >
        <ComboboxList
          {...listProps}
          ref={listRef}
        />
      </ComboboxPopUp>
    </ComboboxStateManager>
  )
}
