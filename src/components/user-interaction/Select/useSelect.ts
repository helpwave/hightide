import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSingleSelection } from "@/src/hooks/useSingleSelection";
import { useListNavigation } from "@/src/hooks/useListNavigation";
import { useEventCallbackStabilizer } from "@/src/hooks/useEventCallbackStabelizer";
import { useSearch, useTypeAheadSearch } from "@/src/hooks";

export interface UseSelectOption {
  id: string;
  label?: string;
  disabled?: boolean;
}

export interface UseSelectOptions {
  options: ReadonlyArray<UseSelectOption>;
  value?: string | null;
  initialValue?: string | null;
  initialIsOpen?: boolean;
  onValueChange?: (value: string) => void;
  onEditComplete?: (value: string) => void;
  onClose?: () => void;
  onIsOpenChange?: (isOpen: boolean) => void;
  typeAheadResetMs?: number;
}

export type UseSelectFirstHighlightBehavior = "first" | "last";

export interface UseSelectState {
  value: string | null;
  highlightedValue: string | undefined;
  isOpen: boolean;
  searchQuery: string;
  options: ReadonlyArray<UseSelectOption>;
}

export interface UseSelectComputedState {
  visibleOptionIds: ReadonlyArray<string>;
}

export interface UseSelectActions {
  setIsOpen: (isOpen: boolean, behavior?: UseSelectFirstHighlightBehavior) => void;
  toggleOpen: (behavior?: UseSelectFirstHighlightBehavior) => void;
  setSearchQuery: (query: string) => void;
  highlightFirst: () => void;
  highlightLast: () => void;
  highlightNext: () => void;
  highlightPrevious: () => void;
  highlightItem: (value: string) => void;
  selectValue: (value: string) => void;
  handleTypeaheadKey: (key: string) => boolean;
}

export interface UseSelectReturn extends UseSelectState, UseSelectComputedState, UseSelectActions {}

export function useSelect({
  options,
  value: controlledValue,
  onValueChange,
  onEditComplete,
  initialValue = null,
  onClose,
  onIsOpenChange,
  initialIsOpen = false,
  typeAheadResetMs = 500,
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
  
  const { searchResult: visibleOptions } = useSearch({
    items: options,
    searchQuery,
    toTags: useCallback((o: UseSelectOption) => [o.label], []),
  });

  const visibleOptionIds = useMemo(() => visibleOptions.map((o) => o.id), [visibleOptions]);

  const enabledOptions = useMemo(() => visibleOptions.filter((o) => !o.disabled), [visibleOptions]);

  const listNav = useListNavigation({
    options: enabledOptions.map((o) => o.id),
    initialValue: selection.selection,
  });

  const typeAhead = useTypeAheadSearch({
    options: enabledOptions,
    resetTimer: typeAheadResetMs,
    toString: (o) => o.label ?? "",
    onResultChange: useCallback(
      (option: UseSelectOption | null) => {
        if (option) listNav.highlight(option.id);
      },
      [listNav]
    ),
  });

  useEffect(() => {
    if (!isOpen) typeAhead.reset();
  }, [isOpen]);

  const state: UseSelectState = useMemo(() => ({
    value: selection.selection,
    highlightedValue: listNav.highlightedId,
    isOpen,
    searchQuery,
    options,
  }), [selection.selection, listNav.highlightedId, isOpen, searchQuery, options]);

  const computedState: UseSelectComputedState = useMemo(() => ({
    visibleOptionIds,
  }), [visibleOptionIds]);

  const highlightItem = useCallback((value: string) => {
    if (!enabledOptions.some((o) => o.id === value)) return;
    listNav.highlight(value);
  }, [enabledOptions, listNav]);

  const handleTypeaheadKey = useCallback(
    (key: string): boolean => {
      typeAhead.addToTypeAhead(key.toLowerCase());
      return true;
    },
    [typeAhead]
  );

  const setIsOpenWrapper = useCallback((isOpen: boolean, behavior?: UseSelectFirstHighlightBehavior) => {
    behavior = behavior ?? "first";
    if(isOpen) {
      if(selection.selection == null) {
        if(behavior === "first") {
          listNav.first();
        } else if (behavior === "last") {
          listNav.last();
        }
      } else {
        highlightItem(selection.selection);
      }
    } else {
      setSearchQuery("");
      onCloseStable?.();
    }
    setIsOpen(isOpen);
    onIsOpenChangeStable(isOpen);
  }, [setIsOpen, highlightItem, onCloseStable, onEditCompleteStable, selection.selection, onIsOpenChangeStable]);

  const toggleOpenWrapper = useCallback((behavior?: UseSelectFirstHighlightBehavior) => {
    const next = !isOpen;
    setIsOpenWrapper(next, behavior);
  }, [setIsOpenWrapper]);

  const actions: UseSelectActions = useMemo(() => ({
    selectValue: (id: string) => selection.selectValue(id),
    setIsOpen: setIsOpenWrapper,
    toggleOpen: toggleOpenWrapper,
    setSearchQuery,
    highlightFirst: listNav.first,
    highlightLast: listNav.last,
    highlightNext: listNav.next,
    highlightPrevious: listNav.previous,
    highlightItem,
    handleTypeaheadKey,
  }), [setIsOpenWrapper, listNav.first, listNav.last, listNav.next, listNav.previous, highlightItem, handleTypeaheadKey]);

  return useMemo(() => ({
    ...state,
    ...computedState,
    ...actions,
  }), [state, computedState, actions]);
}
