import { RefObject, useEffect, useId, useMemo, useRef } from "react";
import { useListNavigation } from "@/src/hooks/useListNavigation";
import { useControlledState } from "@/src/hooks/useControlledState";
import { MultiSearchWithMapping } from "@/src/utils/simpleSearch";
import type {
  ComboboxContextType,
} from "./ComboboxContext";

export interface UseComboboxOption<T = string> {
  id: string;
  value: T;
  label: string;
  disabled?: boolean;
  ref: RefObject<HTMLElement>;
}

export interface UseComboboxConfiguration {
  id?: string;
}

export interface UseComboboxState {
  searchString?: string;
  onSearchStringChange?: (value: string) => void;
  initialSearchString?: string;
}

export interface UseComboboxProps<T = string> extends UseComboboxConfiguration, UseComboboxState {
  options: ReadonlyArray<UseComboboxOption<T>>;
  onItemClick: (id: T) => void;
}

export type UseComboboxResult<T> = Omit<ComboboxContextType<T>, "registerOption">;

export function useCombobox<T = string>({
  onItemClick,
  id: idProp,
  options,
  searchString: controlledSearchString,
  onSearchStringChange,
  initialSearchString = "",
}: UseComboboxProps<T>): UseComboboxResult<T> {
  const generatedId = useId();
  const rootId = idProp ?? `combobox-${generatedId}`;
  const listboxId = `${rootId}-listbox`;

  const [searchString, setSearchString] = useControlledState({
    value: controlledSearchString,
    onValueChange: onSearchStringChange,
    defaultValue: initialSearchString,
    isControlled: controlledSearchString !== undefined,
  });

  const listRef = useRef<HTMLUListElement>(null);

  const visibleOptions = useMemo(() => {
    const q = (searchString ?? "").trim().toLowerCase();
    if (!q) return options;
    return MultiSearchWithMapping(searchString ?? "", [...options], (o) => [o.label]);
  }, [options, searchString]);

  const visibleOptionIds = useMemo(() => visibleOptions.map((o) => o.id), [visibleOptions]);

  const listNav = useListNavigation({
    options: visibleOptionIds,
  });

  const lastScrolledId = useRef<string | null>(null);
  useEffect(() => {
    if(lastScrolledId.current === listNav.highlightedId) return;
    const opt = options.find((o) => o.id === listNav.highlightedId);
    if(opt?.ref?.current) {
      lastScrolledId.current = listNav.highlightedId;
      opt.ref.current.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
    }
  }, [listNav.highlightedId, options]);

  const highlighting = useMemo(
    () => ({
      value: listNav.highlightedId ?? undefined,
      setValue: (id: string) => {
        const option = options.find((o) => o.id === id);
        if (option) {
          listNav.highlight(id);
        }
      },
      next: listNav.next,
      previous: listNav.previous,
      first: listNav.first,
      last: listNav.last,
    }),
    [visibleOptions, listNav]
  );

  return useMemo((): UseComboboxResult<T> => ({
    ids: { root: rootId, listbox: listboxId },
    searchString: searchString ?? "",
    setSearchString,
    visibleOptions,
    highlighting,
    onItemClick,
    listRef,
  }), [rootId, listboxId, searchString, setSearchString, visibleOptions, highlighting, onItemClick, listRef]);
}
