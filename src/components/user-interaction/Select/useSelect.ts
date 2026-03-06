import {
  useCallback,
  useMemo,
  useState,
} from "react";
import { useSingleSelection } from "@/src/hooks/useSingleSelection";
import { useListNavigation } from "@/src/hooks/useListNavigation";
import { MultiSearchWithMapping } from "@/src/utils/simpleSearch";
import { useEventCallbackStabilizer } from "@/src/hooks/useEventCallbackStabelizer";

export interface UseSelectOption {
  id: string;
  label?: string;
  disabled?: boolean;
}

export interface UseSelectOptions {
  options: ReadonlyArray<UseSelectOption>;
  value?: string | null;
  onValueChange?: (value: string) => void;
  onEditComplete?: (value: string) => void;
  initialValue?: string | null;
  initialIsOpen?: boolean;
  onClose?: () => void;
  onIsOpenChange?: (isOpen: boolean) => void;
}

export type UseSelectFirstHighlightBehavior = "first" | "last";

export interface UseSelectOpenState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean, behavior?: UseSelectFirstHighlightBehavior) => void;
  toggleOpen: (behavior?: UseSelectFirstHighlightBehavior) => void;
}

export interface UseSelectSearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface UseSelectHighlightState {
  highlightedValue: string | undefined;
  highlightFirst: () => void;
  highlightLast: () => void;
  highlightNext: () => void;
  highlightPrevious: () => void;
  highlightItem: (value: string) => void;
}

export interface UseSelectSelectionState {
  value: string | null;
  selectValue: (value: string) => void;
}

export interface UseSelectReturn extends UseSelectOpenState, UseSelectSearchState, UseSelectHighlightState, UseSelectSelectionState {
  options: ReadonlyArray<UseSelectOption>;
  visibleOptionIds: ReadonlyArray<string>;
}

export function useSelect({
  options,
  value: controlledValue,
  onValueChange,
  onEditComplete,
  initialValue = null,
  onClose,
  onIsOpenChange,
  initialIsOpen = false,
}: UseSelectOptions): UseSelectReturn {
 const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [searchQuery, setSearchQuery] = useState("");

  const onValueChangeStable = useEventCallbackStabilizer(onValueChange);
  const onEditCompleteStable = useEventCallbackStabilizer(onEditComplete);
  const onCloseStable = useEventCallbackStabilizer(onClose);
  const onIsOpenChangeStable = useEventCallbackStabilizer(onIsOpenChange);

  const onSelectionChangeWrapper = useCallback((id: string | null) => {
    if(id === null) return;
    onValueChangeStable(id)
    onEditCompleteStable(id)
    setIsOpen(false);
  }, [onValueChangeStable, onEditCompleteStable, setIsOpen]);

  const selection = useSingleSelection({
    options: options,
    selection: controlledValue,
    onSelectionChange: onSelectionChangeWrapper,
    initialSelection: initialValue,
  });
  
  const visibleOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return options;
    return MultiSearchWithMapping(searchQuery, [...options], (o) => [o.label]);
  }, [options, searchQuery]);

  const visibleOptionIds = useMemo(() => visibleOptions.map((o) => o.id), [visibleOptions]);

  const enabledOptions = useMemo(() => visibleOptions.filter((o) => !o.disabled), [visibleOptions]);

  const listNav = useListNavigation({
    options: enabledOptions.map((o) => o.id),
    initialValue: selection.selection,
  });

  const highlightState: UseSelectHighlightState = useMemo(() => ({
    highlightedValue: listNav.highlightedId,
    highlightFirst: listNav.first,
    highlightLast: listNav.last,
    highlightNext: listNav.next,
    highlightPrevious: listNav.previous,
    highlightItem: (value: string) => {
      if (!enabledOptions.some((o) => o.id === value)) return;
      listNav.highlight(value)
    }
  }), [enabledOptions, listNav]);

  const setIsOpenWrapper = useCallback((isOpen: boolean, behavior?: UseSelectFirstHighlightBehavior) => {
    behavior = behavior ?? "first";
    if(isOpen) {
      if(selection.selection == null) {
        if(behavior === "first") {
          highlightState.highlightFirst();
        } else if (behavior === "last") {
          highlightState.highlightLast();
        }
      } else {
        highlightState.highlightItem(selection.selection);
      }
    } else {
      setSearchQuery("");
      onCloseStable?.();
    }
    setIsOpen(isOpen);
    onIsOpenChangeStable(isOpen);
  }, [setIsOpen, highlightState, onCloseStable, onEditCompleteStable, selection.selection, onIsOpenChangeStable]);


  const selectionState: UseSelectSelectionState = useMemo(() => ({
    value: selection.selection,
    selectValue: (id: string) => selection.selectValue(id),
  }), [selection.selection, selection.selectValue]);

  const openState: UseSelectOpenState = useMemo(() => ({
    isOpen,
    setIsOpen: setIsOpenWrapper,
    toggleOpen: (behavior?: UseSelectFirstHighlightBehavior) => {
      const next = !isOpen;
      setIsOpenWrapper(next, behavior);
    }
  }), [isOpen, setIsOpenWrapper]);

  const searchState: UseSelectSearchState = useMemo(() => ({
    searchQuery,
    setSearchQuery,
  }), [searchQuery, setSearchQuery]);

  return useMemo((): UseSelectReturn => ({
    ...openState,
    ...highlightState,
    ...selectionState,
    ...searchState,
    options,
    visibleOptionIds,
  }), [openState, highlightState, selectionState, searchState, options, visibleOptionIds] );
}
