import { createContext, ReactNode, RefObject, useContext } from "react";

export interface ComboboxOptionType<T = string> {
  value: T;
  label: string;
  display?: ReactNode;
  disabled?: boolean;
}

export interface RegisteredComboboxOption<T = string> extends ComboboxOptionType<T> {
  id: string;
  ref: RefObject<HTMLLIElement>;
}

export interface ComboboxContextIds {
  root: string;
  listbox: string;
}

export interface ComboboxHighlighting {
  value: string | undefined;
  setValue: (value: string) => void;
  next: () => void;
  previous: () => void;
  first: () => void;
  last: () => void;
}

export interface ComboboxContextType<T = string> {
  ids: ComboboxContextIds;
  searchString: string;
  setSearchString: (s: string) => void;
  visibleOptions: ReadonlyArray<ComboboxOptionType<T>>;
  highlighting: ComboboxHighlighting;
  onItemClick: (id: T) => void;
  listRef: RefObject<HTMLUListElement | null>;
  registerOption: (option: RegisteredComboboxOption<T>) => () => void;
}

export const ComboboxContext = createContext<ComboboxContextType<unknown> | null>(null);

export function useComboboxContext<T = string>(): ComboboxContextType<T> {
  const ctx = useContext(ComboboxContext);
  if (ctx == null) {
    throw new Error("Combobox components must be used within ComboboxRoot");
  }
  return ctx as unknown as ComboboxContextType<T>;
}
