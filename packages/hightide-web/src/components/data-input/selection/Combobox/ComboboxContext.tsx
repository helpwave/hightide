import type { Dispatch, RefObject, SetStateAction } from 'react'
import { createContext, useContext } from 'react'
import type { SelectionOptionData } from '../option'

export type ComboboxOptionData<T = string> = SelectionOptionData<T>

export interface ComboboxContextIds {
  trigger: string,
  listbox: string,
  popup: string,
}

export interface ComboboxContextComputedState<T> {
  options: ReadonlyArray<ComboboxOptionData<T>>,
  visibleOptionIds: ReadonlyArray<string>,
  idToOptionMap: Record<string, ComboboxOptionData<T>>,
}

export interface ComboboxContextActions {
  selectOption(id: string): void,
  addNewValue(): void,
  highlightFirst(): void,
  highlightLast(): void,
  highlightNext(): void,
  highlightPrevious(): void,
  highlightItem(id: string): void,
  setIsOpen(open: boolean): void,
}

export interface ComboboxContextLayout {
  listRef: RefObject<HTMLUListElement | null>,
  searchbarRef: RefObject<HTMLInputElement | null>,
}

export interface ComboboxContextSearch {
  searchQuery: string,
  setSearchQuery(query: string): void,
}

export interface ComboboxContextConfig {
  ids: ComboboxContextIds,
  setIds: Dispatch<SetStateAction<ComboboxContextIds>>,
  newValueId: string,
  isAllowingNewValue: boolean,
}

export interface ComboboxContextType<T> extends ComboboxContextComputedState<T>, ComboboxContextActions {
  isInvalid: boolean,
  isDisabled: boolean,
  isReadOnly: boolean,
  isRequired: boolean,
  isOpen: boolean,
  value?: T,
  highlightedId: string | null,
  optionRefs: Record<string, RefObject<HTMLLIElement | null>>,
  config: ComboboxContextConfig,
  layout: ComboboxContextLayout,
  search: ComboboxContextSearch,
}

export const ComboboxContext = createContext<ComboboxContextType<unknown> | null>(null)

export function useComboboxContext<T = string>(): ComboboxContextType<T> {
  const ctx = useContext(ComboboxContext)
  if (ctx == null) {
    throw new Error('useComboboxContext must be used inside a Combobox.StateManager')
  }
  return ctx as ComboboxContextType<T>
}
