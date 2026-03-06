import { useCallback, useMemo } from "react";
import { useListNavigation } from "@/src/hooks/useListNavigation";
import { useControlledState } from "@/src/hooks/useControlledState";
import { MultiSearchWithMapping } from "@/src/utils/simpleSearch";

export interface UseComboboxOption {
  id: string;
  label?: string;
  disabled?: boolean;
}

export interface UseComboboxOptions {
  options: ReadonlyArray<UseComboboxOption>;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  initialSearchQuery?: string;
}

export interface UseComboboxReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  visibleOptionIds: ReadonlyArray<string>;
  highlightedId: string | null;
  highlightFirst: () => void;
  highlightLast: () => void;
  highlightNext: () => void;
  highlightPrevious: () => void;
  highlightItem: (id: string) => void;
}

export function useCombobox({
  options,
  searchQuery: controlledSearchQuery,
  onSearchQueryChange,
  initialSearchQuery = "",
}: UseComboboxOptions): UseComboboxReturn {
  const [searchQuery, setSearchQuery] = useControlledState({
    value: controlledSearchQuery,
    onValueChange: onSearchQueryChange,
    defaultValue: initialSearchQuery,
  });

  const visibleOptions = useMemo(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    if (!q) return options;
    return MultiSearchWithMapping(searchQuery ?? "", [...options], (o) => [o.label]);
  }, [options, searchQuery]);

  const visibleOptionIds = useMemo(() => visibleOptions.map((o) => o.id), [visibleOptions]);

  const enabledOptionIds = useMemo(
    () => visibleOptions.filter((o) => !o.disabled).map((o) => o.id),
    [visibleOptions]
  );

  const listNav = useListNavigation({ options: enabledOptionIds });

  const highlightItem = useCallback(
    (id: string) => {
      if (!enabledOptionIds.includes(id)) return;
      listNav.highlight(id);
    },
    [enabledOptionIds, listNav]
  );

  return useMemo(
    (): UseComboboxReturn => ({
      searchQuery: searchQuery ?? "",
      setSearchQuery,
      visibleOptionIds,
      highlightedId: listNav.highlightedId,
      highlightFirst: listNav.first,
      highlightLast: listNav.last,
      highlightNext: listNav.next,
      highlightPrevious: listNav.previous,
      highlightItem,
    }),
    [
      searchQuery,
      setSearchQuery,
      visibleOptionIds,
      listNav.highlightedId,
      listNav.first,
      listNav.last,
      listNav.next,
      listNav.previous,
      highlightItem,
    ]
  );
}
