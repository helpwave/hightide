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
import { useSingleSelection } from "@/src/hooks/useSingleSelection";
import { useListNavigation } from "@/src/hooks/useListNavigation";
import { MultiSearchWithMapping } from "@/src/utils/simpleSearch";
import type { SelectionOption } from "@/src/hooks/useSingleSelection";
import type {
  SelectContextType,
  SelectContextState,
  SelectIconAppearance,
  RegisteredSelectOption,
} from "./SelectContext";

export interface UseSelectConfiguration extends Partial<FormFieldInteractionStates> {
  id?: string;
  initialIsOpen?: boolean;
  iconAppearance?: SelectIconAppearance;
  showSearch?: boolean;
  
}

export interface UseSelectState extends Partial<FormFieldDataHandling<string>> {
  initialValue?: string;
}

export interface UseSelectProps extends UseSelectConfiguration, UseSelectState {
  onClose?: () => void;
  options: ReadonlyArray<RegisteredSelectOption>;
}

export type UseSelectResult = Omit<SelectContextType, "item"> & {
  item: Omit<SelectContextType["item"], "register">;
};

function toSelectionOptions(
  options: ReadonlyArray<RegisteredSelectOption>
): ReadonlyArray<SelectionOption<string>> {
  return options.map((o) => ({
    value: o.value,
    label: o.label,
    display: o.display,
    disabled: o.disabled,
  }));
}

export function useSelect(props: UseSelectProps): UseSelectResult {
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
    trigger: id ?? "select-" + generatedId,
    content: "select-content-" + generatedId,
    listbox: "select-listbox-" + generatedId,
    searchInput: "select-search-" + generatedId,
  });
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [searchQuery, setSearchQuery] = useState("");

  const selectionOptions = useMemo(
    () => toSelectionOptions(options),
    [options]
  );

  const selection = useSingleSelection({
    options: selectionOptions,
    value: controlledValue !== undefined ? controlledValue : null,
    onSelectionChange: (v) => {
      onValueChange?.(v);
      onEditComplete?.(v);
    },
    initialSelection: initialValue ?? null,
    isControlled: controlledValue !== undefined,
  });

  const visibleOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return options;
    return MultiSearchWithMapping(searchQuery, [...options], (o) => [o.label]);
  }, [options, searchQuery]);

  const listNav = useListNavigation({
    options: visibleOptions.map((o) => o.value),
    initialValue: controlledValue ?? initialValue ?? undefined,
  });

  const selectedOptions = useMemo(
    () =>
      selection.selection != null
        ? options.filter((o) => o.value === selection.selection)
        : [],
    [selection.selection, options]
  );
  const value = useMemo(
    () => (selection.selection != null ? [selection.selection] : []),
    [selection.selection]
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

  const toggleSelection = useCallback(
    (value: string) => {
      if (disabled) return;
      selection.changeSelection(value);
      setIsOpen((prev) => (prev ? false : prev));
    },
    [disabled, selection]
  );

  const highlightItem = useCallback(
    (value: string) => {
      if (disabled || !visibleOptions.some((o) => o.value === value && !o.disabled))
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
    (open?: boolean, opts?: { highlightStartPositionBehavior?: "first" | "last" }) => {
      const next = open ?? !isOpen;
      if (next) {
        const behavior = opts?.highlightStartPositionBehavior ?? "first";
        const list = visibleOptions.filter((o) => !o.disabled);
        const firstSelected = list.find((o) => o.value === selection.selection);
        const fallback = behavior === "first" ? list[0] : list[list.length - 1];
        const toHighlight = firstSelected ?? fallback;
        if (toHighlight) listNav.highlight(toHighlight.value);
      } else {
        setSearchQuery("");
        onClose?.();
      }
      setIsOpen(next);
    },
    [isOpen, visibleOptions, selection.selection, listNav, onClose]
  );

  const state: SelectContextState = {
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
    (): UseSelectResult => ({
      ids,
      setIds: setIds as Dispatch<SetStateAction<typeof ids>>,
      state,
      iconAppearance,
      item: {
        toggleSelection,
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
      toggleSelection,
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
