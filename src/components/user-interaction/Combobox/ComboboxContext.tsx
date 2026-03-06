import type { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import { createContext, useContext } from "react";

export interface ComboboxOptionType<T = string> {
  id: string;
  value: T;
  label?: string;
  display?: ReactNode;
  disabled?: boolean;
  ref: RefObject<HTMLElement>;
}

export interface ComboboxContextIds {
  trigger: string;
  listbox: string;
}

export interface ComboboxContextInternalState {
  highlightedId: string | null;
}

export interface ComboboxContextComputedState<T> {
  options: ReadonlyArray<ComboboxOptionType<T>>;
  visibleOptionIds: ReadonlyArray<string>;
  idToOptionMap: Record<string, ComboboxOptionType<T>>;
}

export interface ComboboxContextActions<T> {
  registerOption(option: ComboboxOptionType<T>): () => void;
  selectOption(id: string): void;
  highlightFirst(): void;
  highlightLast(): void;
  highlightNext(): void;
  highlightPrevious(): void;
  highlightItem(id: string): void;
}

export interface ComboboxContextLayout {
  listRef: RefObject<HTMLUListElement | null>;
  registerList(ref: RefObject<HTMLUListElement | null>): () => void;
}

export interface ComboboxContextSearch {
  searchQuery: string;
  setSearchQuery(query: string): void;
}

export interface ComboboxContextConfig {
  ids: ComboboxContextIds;
  setIds: Dispatch<SetStateAction<ComboboxContextIds>>;
}

export interface ComboboxContextType<T> extends ComboboxContextInternalState, ComboboxContextComputedState<T>, ComboboxContextActions<T> {
  config: ComboboxContextConfig;
  layout: ComboboxContextLayout;
  search: ComboboxContextSearch;
}

export const ComboboxContext = createContext<ComboboxContextType<unknown> | null>(null);

export function useComboboxContext<T = string>(): ComboboxContextType<T> {
  const ctx = useContext(ComboboxContext);
  if (ctx == null) {
    throw new Error("useComboboxContext must be used within ComboboxRoot");
  }
  return ctx as ComboboxContextType<T>;
}
