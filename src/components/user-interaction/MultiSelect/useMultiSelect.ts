import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMultiSelection } from "@/src/hooks/useMultiSelection";
import { useListNavigation } from "@/src/hooks/useListNavigation";
import { useEventCallbackStabilizer } from "@/src/hooks/useEventCallbackStabelizer";
import { useSearch, useTypeAheadSearch } from "@/src/hooks";

export interface UseMultiSelectOption {
  id: string;
  label?: string;
  disabled?: boolean;
}

export interface UseMultiSelectOptions {
  options: ReadonlyArray<UseMultiSelectOption>;
  value?: ReadonlyArray<string>;
  onValueChange?: (value: string[]) => void;
  onEditComplete?: (value: string[]) => void;
  initialValue?: string[];
  initialIsOpen?: boolean;
  onClose?: () => void;
  typeAheadResetMs?: number;
}

export type UseMultiSelectFirstHighlightBehavior = "first" | "last";

export interface UseMultiSelectState {
  value: string[];
  highlightedId: string | null;
  isOpen: boolean;
  searchQuery: string;
  options: ReadonlyArray<UseMultiSelectOption>;
}

export interface UseMultiSelectComputedState {
  visibleOptionIds: ReadonlyArray<string>;
}

export interface UseMultiSelectActions {
  setIsOpen: (isOpen: boolean, behavior?: UseMultiSelectFirstHighlightBehavior) => void;
  toggleOpen: (behavior?: UseMultiSelectFirstHighlightBehavior) => void;
  setSearchQuery: (query: string) => void;
  highlightFirst: () => void;
  highlightLast: () => void;
  highlightNext: () => void;
  highlightPrevious: () => void;
  highlightItem: (id: string) => void;
  toggleSelection: (id: string, isSelected?: boolean) => void;
  setSelection: (ids: string[]) => void;
  isSelected: (id: string) => boolean;
  handleTypeaheadKey: (key: string) => void;
}

export interface UseMultiSelectReturn extends UseMultiSelectState, UseMultiSelectComputedState, UseMultiSelectActions {}

export function useMultiSelect({
  options,
  value: controlledValue,
  onValueChange,
  onEditComplete,
  initialValue = [],
  onClose,
  initialIsOpen = false,
  typeAheadResetMs = 500,
}: UseMultiSelectOptions): UseMultiSelectReturn {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [searchQuery, setSearchQuery] = useState("");

  const selectionOptions = useMemo(
    () => options.map((o) => ({ id: o.id, disabled: o.disabled })),
    [options]
  );

  const selection = useMultiSelection<string>({
    options: selectionOptions,
    value: controlledValue,
    onSelectionChange: (ids) => onValueChange?.(Array.from(ids)),
    initialSelection: initialValue ?? [],
    isControlled: controlledValue !== undefined,
  });

  const editCompleteStable = useEventCallbackStabilizer(onEditComplete);
  const onCloseStable = useEventCallbackStabilizer(onClose);

  const { searchResult: visibleOptions } = useSearch({
    items: options,
    searchQuery,
    toTags: useCallback((o: UseMultiSelectOption) => [o.label ?? ""], []),
  });

  const visibleOptionIds = useMemo(
    () => visibleOptions.map((o) => o.id),
    [visibleOptions]
  );

  const enabledOptions = useMemo(
    () => visibleOptions.filter((o) => !o.disabled),
    [visibleOptions]
  );

  const listNav = useListNavigation({
    options: enabledOptions.map((o) => o.id),
    initialValue: selection.selection[0] ?? null,
  });

  const typeAhead = useTypeAheadSearch({
    options: enabledOptions,
    resetTimer: typeAheadResetMs,
    toString: (o) => o.label ?? "",
    onResultChange: useCallback(
      (option: UseMultiSelectOption | null) => {
        if (option) listNav.highlight(option.id);
      },
      [listNav]
    ),
  });

  useEffect(() => {
    if (!isOpen) typeAhead.reset();
  }, [isOpen]);

  const highlightItem = useCallback(
    (id: string) => {
      if (!enabledOptions.some((o) => o.id === id)) return;
      listNav.highlight(id);
    },
    [enabledOptions, listNav]
  );

  const toggleSelectionValue = useCallback(
    (id: string, isSelected?: boolean) => {
      const before = selection.isSelected(id);
      const next = isSelected ?? !before;
      if (next) {
        selection.toggleSelection(id);
      } else {
        selection.setSelection(selection.selection.filter((s) => s !== id));
      }
      highlightItem(id);
    },
    [selection, highlightItem]
  );

  const setIsOpenWrapper = useCallback(
    (open: boolean, behavior?: UseMultiSelectFirstHighlightBehavior) => {
      setIsOpen(open);
      behavior = behavior ?? "first";
      if (open) {
        if (enabledOptions.length > 0) {
          let selected: UseMultiSelectOption | undefined;
          if (behavior === "first") {
            selected = enabledOptions.find((o) => selection.isSelected(o.id));
            selected ??= enabledOptions[0];
          } else if (behavior === "last") {
            selected = [...enabledOptions]
              .reverse()
              .find((o) => selection.isSelected(o.id));
            selected ??= enabledOptions[enabledOptions.length - 1];
          }
          if (selected) highlightItem(selected.id);
        }
      } else {
        setSearchQuery("");
        onCloseStable?.();
        editCompleteStable?.(Array.from(selection.selection));
      }
    },
    [
      highlightItem,
      onCloseStable,
      editCompleteStable,
      selection.selection,
      selection.isSelected,
      enabledOptions,
    ]
  );

  const toggleOpenWrapper = useCallback(
    (behavior?: UseMultiSelectFirstHighlightBehavior) => {
      setIsOpenWrapper(!isOpen, behavior);
    },
    [isOpen, setIsOpenWrapper]
  );

  const state: UseMultiSelectState = useMemo(
    () => ({
      value: [...selection.selection],
      highlightedId: listNav.highlightedId,
      isOpen,
      searchQuery,
      options,
    }),
    [
      selection.selection,
      listNav.highlightedId,
      isOpen,
      searchQuery,
      options,
    ]
  );

  const computedState: UseMultiSelectComputedState = useMemo(
    () => ({ visibleOptionIds }),
    [visibleOptionIds]
  );

  const actions: UseMultiSelectActions = useMemo(
    () => ({
      setIsOpen: setIsOpenWrapper,
      toggleOpen: toggleOpenWrapper,
      setSearchQuery,
      highlightFirst: listNav.first,
      highlightLast: listNav.last,
      highlightNext: listNav.next,
      highlightPrevious: listNav.previous,
      highlightItem,
      toggleSelection: toggleSelectionValue,
      setSelection: (ids: string[]) => selection.setSelection(ids),
      isSelected: selection.isSelected,
      handleTypeaheadKey: typeAhead.addToTypeAhead,
    }),
    [
      setIsOpenWrapper,
      toggleOpenWrapper,
      listNav.first,
      listNav.last,
      listNav.next,
      listNav.previous,
      highlightItem,
      toggleSelectionValue,
      selection.setSelection,
      selection.isSelected,
      typeAhead.addToTypeAhead,
    ]
  );

  return useMemo(
    (): UseMultiSelectReturn => ({
      ...state,
      ...computedState,
      ...actions,
    }),
    [state, computedState, actions]
  );
}
