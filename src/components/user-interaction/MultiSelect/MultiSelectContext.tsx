import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  createContext,
  useCallback,
  useContext,
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

export type MultiSelectIconAppearance = "left" | "right" | "none";

type RegisteredOption = {
  value: string;
  label: string;
  display: ReactNode;
  disabled: boolean;
  ref: React.RefObject<HTMLElement>;
};

type MultiSelectContextIds = {
  trigger: string;
  content: string;
  listbox: string;
  searchInput: string;
};

type MultiSelectContextState = FormFieldInteractionStates & {
  isOpen: boolean;
  options: RegisteredOption[];
  visibleOptions: RegisteredOption[];
  searchQuery: string;
  value: string[];
  selectedOptions: RegisteredOption[];
  highlightedValue: string | undefined;
};

export type MultiSelectContextType = {
  ids: MultiSelectContextIds;
  setIds: Dispatch<SetStateAction<MultiSelectContextIds>>;
  state: MultiSelectContextState;
  iconAppearance: MultiSelectIconAppearance;
  item: {
    register: (item: RegisteredOption) => () => void;
    unregister: (value: string) => void;
    toggleSelection: (value: string, isSelected?: boolean) => void;
    highlightFirst: () => void;
    highlightLast: () => void;
    highlightItem: (value: string) => void;
    moveHighlightedIndex: (delta: number) => void;
  };
  trigger: {
    ref: React.RefObject<HTMLElement>;
    register: (element: React.RefObject<HTMLElement>) => void;
    unregister: () => void;
    toggleOpen: (isOpen?: boolean, options?: { highlightStartPositionBehavior?: "first" | "last" }) => void;
  };
  search: {
    showSearch: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
  };
};

const MultiSelectContext = createContext<MultiSelectContextType | null>(null);

export function useMultiSelectContext(): MultiSelectContextType {
  const ctx = useContext(MultiSelectContext);
  if (!ctx) throw new Error("useMultiSelectContext must be used within MultiSelectRoot");
  return ctx;
}

export interface SharedMultiSelectRootProps extends Partial<FormFieldInteractionStates> {
  children: ReactNode;
  id?: string;
  initialIsOpen?: boolean;
  iconAppearance?: MultiSelectIconAppearance;
  showSearch?: boolean;
  onClose?: () => void;
}

export interface MultiSelectRootProps
  extends SharedMultiSelectRootProps,
    Partial<FormFieldDataHandling<string[]>> {
  initialValue?: string[];
}

export function useMultiSelect(props: MultiSelectRootProps): MultiSelectContextType {
  const {
    id,
    value: controlledValues,
    onValueChange,
    initialValue,
    onEditComplete,
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
  const [ids, setIds] = useState<MultiSelectContextIds>({
    trigger: id ?? "multi-select-" + generatedId,
    content: "multi-select-content-" + generatedId,
    listbox: "multi-select-listbox-" + generatedId,
    searchInput: "multi-select-search-" + generatedId,
  });
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [options, setOptions] = useState<RegisteredOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const selection = useMultiSelection({
    value: controlledValues,
    onSelectionChange: (v) => onValueChange?.(Array.from(v)),
    initialSelection: initialValue,
    isControlled: controlledValues !== undefined,
  });

  const visibleOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return options;
    return MultiSearchWithMapping(searchQuery, options, (o) => [o.label]);
  }, [options, searchQuery]);

  const listNav = useListNavigation({
    options: visibleOptions.map((o) => o.value),
    initialValue: controlledValues?.[0] ?? initialValue?.[0],
  });

  const value = useMemo(() => [...selection.selection], [selection.selection]);
  const selectedOptions = useMemo(
    () =>
      value
        .map((v) => options.find((o) => o.value === v))
        .filter((o): o is RegisteredOption => o != null),
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
    opt?.ref.current?.scrollIntoView({ behavior: "instant", block: "nearest" });
  }, [listNav.highlightedId, options]);

  const registerItem = useCallback(
    (item: RegisteredOption) => {
      setOptions((prev) => {
        const next = prev.filter((o) => o.value !== item.value);
        next.push(item);
        next.sort((a, b) => {
          const aEl = a.ref.current;
          const bEl = b.ref.current;
          if (!aEl || !bEl) return 0;
          return aEl.compareDocumentPosition(bEl) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });
        return next;
      });
      const unregSelection = selection.registerOption({
        value: item.value,
        label: item.label,
        display: item.display,
        disabled: item.disabled,
      });
      return () => {
        unregSelection();
        setOptions((prev) => prev.filter((o) => o.value !== item.value));
      };
    },
    [selection, listNav]
  );

  const unregisterItem = useCallback((value: string) => {
    setOptions((prev) => prev.filter((o) => o.value !== value));
  }, []);

  const toggleSelectionValue = useCallback(
    (optionValue: string, isSelected?: boolean) => {
      if (disabled) return;
      const before = selection.isSelected(optionValue);
      const next = isSelected ?? !before;
      if (next) selection.toggleSelection(optionValue);
      else selection.setSelection([...selection.selection].filter((v) => v !== optionValue));
      listNav.highlight(optionValue);
    },
    [disabled, selection, listNav]
  );

  const highlightItem = useCallback(
    (value: string) => {
      if (disabled || !visibleOptions.some((o) => o.value === value && !o.disabled)) return;
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
      const startIdx = idx < 0 ? 0 : (idx + (delta % list.length) + list.length) % list.length;
      const isForward = delta >= 0;
      let nextIdx = startIdx;
      for (let i = 0; i < list.length; i++) {
        const j = (startIdx + (isForward ? i : -i) + list.length) % list.length;
        if (!list[j].disabled) {
          nextIdx = j;
          break;
        }
      }
      listNav.highlight(list[nextIdx].value);
    },
    [visibleOptions, listNav]
  );

  const registerTrigger = useCallback((ref: React.RefObject<HTMLElement>) => {
    (triggerRef as React.MutableRefObject<HTMLElement | null>).current = ref.current;
  }, []);

  const unregisterTrigger = useCallback(() => {
    (triggerRef as React.MutableRefObject<HTMLElement | null>).current = null;
  }, []);

  const handleClose = useCallback(() => {
    onEditComplete?.(controlledValues);
    onClose?.();
  }, [onEditComplete, onClose, controlledValues]);

  const toggleOpen = useCallback(
    (open?: boolean, opts?: { highlightStartPositionBehavior?: "first" | "last" }) => {
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
        handleClose();
      }
      setIsOpen(next);
    },
    [isOpen, visibleOptions, selection, listNav, handleClose]
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
    (): MultiSelectContextType => ({
      ids,
      setIds,
      state,
      iconAppearance,
      item: {
        register: registerItem,
        unregister: unregisterItem,
        toggleSelection: toggleSelectionValue,
        highlightFirst,
        highlightLast,
        highlightItem,
        moveHighlightedIndex,
      },
      trigger: { ref: triggerRef, register: registerTrigger, unregister: unregisterTrigger, toggleOpen },
      search: { showSearch, searchQuery, setSearchQuery },
    }),
    [
      ids,
      state,
      iconAppearance,
      registerItem,
      unregisterItem,
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

export function MultiSelectRoot(props: MultiSelectRootProps) {
  const value = useMultiSelect(props);
  return (
    <MultiSelectContext.Provider value={value}>
      {props.children}
    </MultiSelectContext.Provider>
  );
}
