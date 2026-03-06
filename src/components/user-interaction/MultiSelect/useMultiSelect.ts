import {
  useCallback,
  useMemo,
  useState,
} from "react";
import { useMultiSelection } from "@/src/hooks/useMultiSelection";
import { useListNavigation } from "@/src/hooks/useListNavigation";
import { MultiSearchWithMapping } from "@/src/utils/simpleSearch";
import { useEventCallbackStabilizer } from "@/src/hooks/useEventCallbackStabelizer";

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
}

export type UseMultiSelectFirstHighlightBehavior = "first" | "last";

export interface UseMultiSelectOpenState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean, behavior?: UseMultiSelectFirstHighlightBehavior) => void;
  toggleOpen: (behavior?: UseMultiSelectFirstHighlightBehavior) => void;
}

export interface UseMultiSelectSearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface UseMultiSelectHighlightState {
  highlightedId: string | null;
  highlightFirst: () => void;
  highlightLast: () => void;
  highlightNext: () => void;
  highlightPrevious: () => void;
  highlightItem: (id: string) => void;
}

export interface UseMultiSelectSelectionState {
  value: string[];
  toggleSelection: (id: string, isSelected?: boolean) => void;
  setSelection: (ids: string[]) => void;
  isSelected: (id: string) => boolean;
}

export interface UseMultiSelectReturn
  extends UseMultiSelectOpenState,
    UseMultiSelectSearchState,
    UseMultiSelectHighlightState,
    UseMultiSelectSelectionState {
  options: ReadonlyArray<UseMultiSelectOption>;
  visibleOptionIds: ReadonlyArray<string>;
}

export function useMultiSelect({
  options,
  value: controlledValue,
  onValueChange,
  onEditComplete,
  initialValue = [],
  onClose,
  initialIsOpen = false,
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

  const visibleOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return options;
    return MultiSearchWithMapping(searchQuery, [...options], (o) => [o.label ?? ""]);
  }, [options, searchQuery]);

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

  const highlightState: UseMultiSelectHighlightState = useMemo(
    () => ({
      highlightedId: listNav.highlightedId,
      highlightFirst: listNav.first,
      highlightLast: listNav.last,
      highlightNext: listNav.next,
      highlightPrevious: listNav.previous,
      highlightItem: (id: string) => {
        if (!enabledOptions.some((o) => o.id === id)) return;
        listNav.highlight(id);
      },
    }),
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
      highlightState.highlightItem(id);
    },
    [selection, highlightState]
  );

  const selectionState: UseMultiSelectSelectionState = useMemo(
    () => ({
      value: [...selection.selection],
      toggleSelection: toggleSelectionValue,
      setSelection: (ids: string[]) => selection.setSelection(ids),
      isSelected: selection.isSelected,
    }),
    [selection.selection, selection.setSelection, selection.isSelected, toggleSelectionValue]
  );

  const setIsOpenWrapper = useCallback(
    (open: boolean, behavior?: UseMultiSelectFirstHighlightBehavior) => {
      setIsOpen(open);
      behavior = behavior ?? "first";
      if (open) {
        if (enabledOptions.length > 0) {
          let selected: UseMultiSelectOption | undefined
          if(behavior === "first") {
            selected = enabledOptions.find((o) =>
              selection.isSelected(o.id)
            );
            selected ??= enabledOptions[0];
          } else if (behavior === "last") {
            selected = [...enabledOptions].reverse().find((o) =>
              selection.isSelected(o.id)
            );
            selected ??= enabledOptions[enabledOptions.length - 1];
          }
          if (selected) highlightState.highlightItem(selected.id);
        }
      } else {
        setSearchQuery("");
        onCloseStable?.();
        editCompleteStable?.(Array.from(selection.selection));
      }
    },
    [
      highlightState,
      onCloseStable,
      editCompleteStable,
      selection.selection,
      selection.isSelected,
      enabledOptions,
    ]
  );

  const openState: UseMultiSelectOpenState = useMemo(
    () => ({
      isOpen,
      setIsOpen: setIsOpenWrapper,
      toggleOpen: (behavior?: UseMultiSelectFirstHighlightBehavior) => {
        setIsOpenWrapper(!isOpen, behavior);
      },
    }),
    [isOpen, setIsOpenWrapper]
  );

  const searchState: UseMultiSelectSearchState = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
    }),
    [searchQuery, setSearchQuery]
  );

  return useMemo(
    (): UseMultiSelectReturn => ({
      ...openState,
      ...highlightState,
      ...selectionState,
      ...searchState,
      options,
      visibleOptionIds,
    }),
    [
      openState,
      highlightState,
      selectionState,
      searchState,
      options,
      visibleOptionIds,
    ]
  );
}
