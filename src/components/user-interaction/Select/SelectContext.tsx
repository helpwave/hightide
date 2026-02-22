import type { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import { createContext, useContext } from "react";
import type { FormFieldInteractionStates } from "@/src/components/form/FieldLayout";

export interface SelectOptionType {
  value: string;
  label: string;
  display: ReactNode;
  disabled: boolean;
}

export interface RegisteredSelectOption extends SelectOptionType {
  ref: RefObject<HTMLElement>;
}

export interface SelectContextIds {
  trigger: string;
  content: string;
  listbox: string;
  searchInput: string;
}

export interface SelectContextState extends FormFieldInteractionStates {
  isOpen: boolean;
  options: ReadonlyArray<RegisteredSelectOption>;
  visibleOptions: ReadonlyArray<RegisteredSelectOption>;
  searchQuery: string;
  value: string[];
  selectedOptions: ReadonlyArray<RegisteredSelectOption>;
  highlightedValue: string | undefined;
}

export type SelectIconAppearance = "left" | "right" | "none";

export interface SelectContextType {
  ids: SelectContextIds;
  setIds: Dispatch<SetStateAction<SelectContextIds>>;
  state: SelectContextState;
  iconAppearance: SelectIconAppearance;
  item: {
    register: (item: RegisteredSelectOption) => () => void;
    toggleSelection: (value: string) => void;
    highlightFirst: () => void;
    highlightLast: () => void;
    highlightItem: (value: string) => void;
    moveHighlightedIndex: (delta: number) => void;
  };
  trigger: {
    ref: RefObject<HTMLElement>;
    register: (element: RefObject<HTMLElement>) => void;
    unregister: () => void;
    toggleOpen: (
      isOpen?: boolean,
      options?: { highlightStartPositionBehavior?: "first" | "last" }
    ) => void;
  };
  search: {
    showSearch: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
  };
}

const SelectContext = createContext<SelectContextType | null>(null);

export function useSelectContext(): SelectContextType {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("useSelectContext must be used within SelectRoot");
  return ctx;
}

export { SelectContext };
