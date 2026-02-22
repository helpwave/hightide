import type { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FormFieldInteractionStates } from "@/src/components/form/FieldLayout";
import type { FormFieldDataHandling } from "@/src/components/form/FormField";
import { useMultiSelection } from "@/src/hooks/useMultiSelection";
import { useListNavigation } from "@/src/hooks/useListNavigation";
import { MultiSearchWithMapping } from "@/src/utils/simpleSearch";
import type { SelectionOption } from "@/src/hooks/useSingleSelection";
import type {
  MultiSelectContextType,
  MultiSelectContextState,
  RegisteredMultiSelectOption,
} from "./MultiSelectContext";
import type { MultiSelectIconAppearance } from "./MultiSelectContext";

export interface UseMultiSelectConfiguration extends Partial<FormFieldInteractionStates> {
  id?: string;
  initialIsOpen?: boolean;
  iconAppearance?: MultiSelectIconAppearance;
  showSearch?: boolean;
  onClose?: () => void;
}

export interface UseMultiSelectState extends Partial<FormFieldDataHandling<string[]>> {
  initialValue?: string[];
}

export interface UseMultiSelectProps extends UseMultiSelectConfiguration, UseMultiSelectState {
  options: ReadonlyArray<RegisteredMultiSelectOption>;
}

export type UseMultiSelectResult = Omit<MultiSelectContextType, "item"> & {
  item: Omit<MultiSelectContextType["item"], "register">;
};

function toSelectionOptions(
  options: ReadonlyArray<RegisteredMultiSelectOption>
): ReadonlyArray<SelectionOption<string>> {
  return options.map((o) => ({
    value: o.value,
    label: o.label,
    display: o.display,
    disabled: o.disabled,
  }));
}

export function useMultiSelect(props: UseMultiSelectProps): UseMultiSelectResult {
  const {
    options,
    id,
    value: controlledValue,
    onValueChange,
    onEditComplete,
    initialValue,
    onClose,
    initialIsOpen = false,
    disabled = false,
    readOnly = false,
    required = false,
    invalid = false,
    showSearch = false,
    iconAppearance = "left",
  } = props;

  const triggerRef = useRef<HTMLElement>(null);
  const generatedId = useId();
  const [ids, setIds] = useState({
    trigger: id ?? "multi-select-" + generatedId,
    content: "multi-select-content-" + generatedId,
    listbox: "multi-select-listbox-" + generatedId,
    searchInput: "multi-select-search-" + generatedId,
  });
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [searchQuery, setSearchQuery] = useState("");

  const selectionOptions = useMemo(() => toSelectionOptions(options), [options]);

  const selection = useMultiSelection({
    options: selectionOptions,
    value: controlledValue,
    onSelectionChange: (v) => { onValueChange?.(Array.from(v)) },
    initialSelection: initialValue ?? [],
    isControlled: controlledValue !== undefined,
  });

  const visibleOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return options;
    return MultiSearchWithMapping(searchQuery, [...options], (o) => [o.label]);
  }, [options, searchQuery]);

  const listNav = useListNavigation({
    options: visibleOptions.map((o) => o.value),
    initialValue: controlledValue?.[0] ?? initialValue?.[0],
  });

  const value = useMemo(() => [...selection.selection], [selection.selection]);
  const selectedOptions = useMemo(
    () =>
      value
        .map((v) => options.find((o) => o.value === v))
        .filter((o): o is RegisteredMultiSelectOption => o != null),
    [value, options]
  );

  useEffect(() => {
    if (
      listNav.highlightedId != null &&
      !visibleOptions.some((o) => o.value === listNav.highlightedId)
    ) {
      const first = visibleOptions.find((o) => !o.disabled);
      if (first) listNav.highlight(first.value);
    }
  }, [visibleOptions, listNav.highlightedId, listNav.highlight]);

  useEffect(() => {
    const opt = options.find((o) => o.value === listNav.highlightedId);
    opt?.ref?.current?.scrollIntoView?.({ behavior: "instant", block: "nearest" });
  }, [listNav.highlightedId, options]);

  const toggleSelectionValue = useCallback(
    (optionValue: string, isSelected?: boolean) => {
      if (disabled) return;
      const before = selection.isSelected(optionValue);
      const next = isSelected ?? !before;
      if (next) {
        selection.toggleSelection(optionValue);
      } else {
        selection.setSelection(selection.selection.filter((v) => v !== optionValue));
      }
      listNav.highlight(optionValue);
    },
    [disabled, selection, listNav]
  );

  const highlightItem = useCallback(
    (value: string) => {
      if (
        disabled ||
        !visibleOptions.some((o) => o.value === value && !o.disabled)
      )
        return;
      listNav.highlight(value);
    },
    [disabled, visibleOptions, listNav]
  );

  const highlightFirst = useCallback(() => {
    const first = visibleOptions.find((o) => !o.disabled);
    if (first) listNav.highlight(first.value);
  }, [visibleOptions, listNav]);

  const highlightLast = useCallback(() => {
    const last = [...visibleOptions].reverse().find((o) => !o.disabled);
    if (last) listNav.highlight(last.value);
  }, [visibleOptions, listNav]);

  const moveHighlightedIndex = useCallback(
    (delta: number) => {
      const list = visibleOptions.filter((o) => !o.disabled);
      if (list.length === 0) return;
      const idx = list.findIndex((o) => o.value === listNav.highlightedId);
      const startIdx =
        idx < 0 ? 0 : (idx + (delta % list.length) + list.length) % list.length;
      const isForward = delta >= 0;
      let nextIdx = startIdx;
      for (let i = 0; i < list.length; i++) {
        const j =
          (startIdx + (isForward ? i : -i) + list.length) % list.length;
        if (!list[j].disabled) {
          nextIdx = j;
          break;
        }
      }
      listNav.highlight(list[nextIdx].value);
    },
    [visibleOptions, listNav]
  );

  const registerTrigger = useCallback((ref: RefObject<HTMLElement>) => {
    (triggerRef as React.MutableRefObject<HTMLElement | null>).current =
      ref.current;
  }, []);

  const unregisterTrigger = useCallback(() => {
    (triggerRef as React.MutableRefObject<HTMLElement | null>).current = null;
  }, []);

  const toggleOpen = useCallback(
    (
      open?: boolean,
      opts?: { highlightStartPositionBehavior?: "first" | "last" }
    ) => {
      const next = open ?? !isOpen;
      if (next) {
        const behavior = opts?.highlightStartPositionBehavior ?? "first";
        const list = visibleOptions.filter((o) => !o.disabled);
        const firstSelected = list.find((o) => selection.isSelected(o.value));
        const fallback = behavior === "first" ? list[0] : list[list.length - 1];
        const toHighlight = firstSelected ?? fallback;
        if (toHighlight) listNav.highlight(toHighlight.value);
      } else {
        setSearchQuery("");
        onClose?.();
      }
      setIsOpen(next);
    },
    [isOpen, visibleOptions, selection, listNav, onClose]
  );

  const state: MultiSelectContextState = {
    isOpen,
    options,
    visibleOptions,
    searchQuery,
    value,
    selectedOptions,
    highlightedValue: listNav.highlightedId ?? undefined,
    disabled,
    invalid,
    readOnly,
    required,
  };

  return useMemo(
    (): UseMultiSelectResult => ({
      ids,
      setIds: setIds as Dispatch<SetStateAction<typeof ids>>,
      state,
      iconAppearance,
      item: {
        toggleSelection: toggleSelectionValue,
        highlightFirst,
        highlightLast,
        highlightItem,
        moveHighlightedIndex,
      },
      trigger: {
        ref: triggerRef,
        register: registerTrigger,
        unregister: unregisterTrigger,
        toggleOpen,
      },
      search: { showSearch, searchQuery, setSearchQuery },
    }),
    [
      ids,
      state,
      iconAppearance,
      toggleSelectionValue,
      highlightFirst,
      highlightLast,
      highlightItem,
      moveHighlightedIndex,
      registerTrigger,
      unregisterTrigger,
      toggleOpen,
      showSearch,
      searchQuery,
    ]
  );
}
