import type { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import { createContext, useContext } from "react";
import type { FormFieldInteractionStates } from "@/src/components/form/FieldLayout";

export interface MultiSelectOptionType {
  value: string;
  label: string;
  display: ReactNode;
  disabled: boolean;
}

export interface RegisteredMultiSelectOption extends MultiSelectOptionType {
  ref: RefObject<HTMLElement>;
}

export interface MultiSelectContextIds {
  trigger: string;
  content: string;
  listbox: string;
  searchInput: string;
}

export interface MultiSelectContextState extends FormFieldInteractionStates {
  isOpen: boolean;
  options: ReadonlyArray<RegisteredMultiSelectOption>;
  visibleOptions: ReadonlyArray<RegisteredMultiSelectOption>;
  searchQuery: string;
  value: string[];
  selectedOptions: ReadonlyArray<RegisteredMultiSelectOption>;
  highlightedValue: string | undefined;
}

export type MultiSelectIconAppearance = "left" | "right" | "none";

export interface MultiSelectContextType {
  ids: MultiSelectContextIds;
  setIds: Dispatch<SetStateAction<MultiSelectContextIds>>;
  state: MultiSelectContextState;
  iconAppearance: MultiSelectIconAppearance;
  item: {
    register: (item: RegisteredMultiSelectOption) => () => void;
    toggleSelection: (value: string, isSelected?: boolean) => void;
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

const MultiSelectContext = createContext<MultiSelectContextType | null>(null);

export function useMultiSelectContext(): MultiSelectContextType {
  const ctx = useContext(MultiSelectContext);
  if (!ctx) throw new Error("useMultiSelectContext must be used within MultiSelectRoot");
  return ctx;
}

export { MultiSelectContext };
