import type { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import { createContext, useContext } from "react";
import { UseSelectFirstHighlightBehavior } from "./useSelect";
import { FormFieldInteractionStates } from "../../form/FieldLayout";

export interface SelectOptionType<T = string> {
  id: string;
  value: T;
  label?: string;
  display?: ReactNode;
  disabled?: boolean;
  ref: RefObject<HTMLElement>;
}

export interface SelectContextIds {
  trigger: string;
  content: string;
  listbox: string;
  searchInput: string;
}

export interface SelectContextInternalState extends FormFieldInteractionStates {
  selectedId: string | null;
  highlightedId: string | null;
  isOpen: boolean;
}

export interface SelectContextComputedState<T> {
  options: ReadonlyArray<SelectOptionType<T>>;
  visibleOptionIds: ReadonlyArray<string>;
  idToOptionMap: Record<string, SelectOptionType<T>>;
}

export interface SelectContextActions<T> {
  registerOption(option: SelectOptionType<T>): () => void;
  toggleSelection(id: string): void;
  highlightFirst(): void;
  highlightLast(): void;
  highlightNext(): void;
  highlightPrevious(): void;
  highlightItem(id: string): void;
  setIsOpen(open: boolean, behavior?: UseSelectFirstHighlightBehavior): void;
  toggleIsOpen(behavior?: UseSelectFirstHighlightBehavior): void;
}

export interface SelectContextLayout {
  triggerRef: RefObject<HTMLElement>;
  registerTrigger(element: RefObject<HTMLElement>): () => void;
}

export interface SelectContextSearch {
  hasSearch: boolean,
  searchQuery?: string,
  setSearchQuery(query: string): void;
}

export type SelectIconAppearance = "left" | "right" | "none";

export interface SelectContextConfig {
  iconAppearance: SelectIconAppearance;
  ids: SelectContextIds;
  setIds: Dispatch<SetStateAction<SelectContextIds>>;
}

export interface SelectContextType<T> extends SelectContextActions<T>, SelectContextInternalState, SelectContextComputedState<T> {
  config: SelectContextConfig;
  layout: SelectContextLayout;
  search: SelectContextSearch;
}

export const SelectContext = createContext<SelectContextType<unknown> | null>(null);

export function useSelectContext<T>(): SelectContextType<T> {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("useSelectContext must be used within SelectRoot");
  return ctx as SelectContextType<T>;
}
