import type { ReactNode, RefObject } from "react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { MultiSelectContext } from "./MultiSelectContext";
import type { MultiSelectContextType, MultiSelectIconAppearance, MultiSelectOptionType } from "./MultiSelectContext";
import { useMultiSelect } from "./useMultiSelect";
import { DOMUtils } from "@/src/utils/dom";
import type { FormFieldDataHandling } from "@/src/components/form/FormField";
import type { FormFieldInteractionStates } from "@/src/components/form/FieldLayout";
import { PopUpContext } from "../../layout";

export interface MultiSelectIds {
  trigger: string;
  content: string;
  listbox: string;
  searchInput: string;
}

export interface MultiSelectRootProps<T> extends Partial<FormFieldDataHandling<T[]>>, Partial<FormFieldInteractionStates> {
  initialValue?: T[];
  compareFunction?: (a: T, b: T) => boolean;
  initialIsOpen?: boolean;
  onClose?: () => void;
  showSearch?: boolean;
  iconAppearance?: MultiSelectIconAppearance;
  children: ReactNode;
}

export function MultiSelectRoot<T>({
  children,
  value,
  onValueChange,
  onEditComplete,
  initialValue,
  compareFunction,
  initialIsOpen = false,
  onClose,
  showSearch = true,
  iconAppearance = "right",
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
}: MultiSelectRootProps<T>) {
  const [triggerRef, setTriggerRef] = useState<RefObject<HTMLElement> | null>(null);
  const [options, setOptions] = useState<MultiSelectOptionType<T>[]>([]);
  const generatedId = useId();
  const [ids, setIds] = useState<MultiSelectIds>({
    trigger: "multi-select-" + generatedId,
    content: "multi-select-content-" + generatedId,
    listbox: "multi-select-listbox-" + generatedId,
    searchInput: "multi-select-search-" + generatedId,
  });

  const registerOption = useCallback((item: MultiSelectOptionType<T>) => {
    setOptions((prev) => {
      const next = prev.filter((o) => o.id !== item.id);
      next.push(item);
      next.sort((a, b) =>
        DOMUtils.compareDocumentPosition(a.ref.current, b.ref.current)
      );
      return next;
    });
    return () => setOptions((prev) => prev.filter((o) => o.id !== item.id));
  }, []);

  const registerTrigger = useCallback((ref: RefObject<HTMLElement>) => {
    setTriggerRef(ref);
    return () => setTriggerRef(null);
  }, []);

  const compare = useMemo(() => compareFunction ?? Object.is, [compareFunction]);

  const idToOptionMap = useMemo(
    () =>
      options.reduce(
        (acc, o) => {
          acc[o.id] = o;
          return acc;
        },
        {} as Record<string, MultiSelectOptionType<T>>
      ),
    [options]
  );

  const mappedValueIds = useMemo(() => {
    if (value == null) return undefined;
    return value
      .map((v) => options.find((o) => compare(o.value, v))?.id)
      .filter((id) => id !== undefined);
  }, [options, value, compare]);

  const mappedInitialValueIds = useMemo(() => {
    if (initialValue == null) return [];
    return initialValue
      .map((v) => options.find((o) => compare(o.value, v))?.id)
      .filter((id) => id !== undefined);
  }, [options, initialValue, compare]);

  const onValueChangeStable = useCallback(
    (ids: string[]) => {
      const values = ids
        .map((id) => idToOptionMap[id]?.value)
        .filter((v): v is T => v != null);
      onValueChange?.(values);
    },
    [idToOptionMap, onValueChange]
  );

  const onEditCompleteStable = useCallback(
    (ids: string[]) => {
      const values = ids
        .map((id) => idToOptionMap[id]?.value)
        .filter((v): v is T => v != null);
      onEditComplete?.(values);
    },
    [idToOptionMap, onEditComplete]
  );

  const state = useMultiSelect({
    options: options.map((o) => ({ id: o.id, label: o.label, disabled: o.disabled })),
    value: mappedValueIds,
    onValueChange: onValueChangeStable,
    onEditComplete: onEditCompleteStable,
    initialValue: mappedInitialValueIds,
    initialIsOpen,
    onClose,
  });

  useEffect(() => {
    if (showSearch === false) {
      state.setSearchQuery("");
    }
  }, [showSearch, state.setSearchQuery]);

  const contextValue = useMemo((): MultiSelectContextType<T> => {
    const valueT = state.value
      .map((id) => idToOptionMap[id]?.value)
      .filter((v): v is T => v != null);
    return {
      invalid,
      disabled,
      readOnly,
      required,
      selectedIds: state.value,
      highlightedId: state.highlightedId,
      isOpen: state.isOpen,
      options,
      visibleOptionIds: state.visibleOptionIds,
      idToOptionMap,
      value: valueT,
      registerOption,
      toggleSelection: state.toggleSelection,
      highlightFirst: state.highlightFirst,
      highlightLast: state.highlightLast,
      highlightNext: state.highlightNext,
      highlightPrevious: state.highlightPrevious,
      highlightItem: state.highlightItem,
      setIsOpen: state.setIsOpen,
      toggleIsOpen: state.toggleOpen,
      config: {
        iconAppearance,
        ids,
        setIds,
      },
      layout: {
        triggerRef,
        registerTrigger,
      },
      search: {
        hasSearch: showSearch,
        searchQuery: state.searchQuery,
        setSearchQuery: state.setSearchQuery,
      },
    };
  }, [
    invalid,
    disabled,
    readOnly,
    required,
    state,
    options,
    idToOptionMap,
    registerOption,
    iconAppearance,
    ids,
    triggerRef,
    registerTrigger,
    showSearch,
  ]);

  return (
    <MultiSelectContext.Provider value={contextValue as MultiSelectContextType<unknown>}>
      <PopUpContext.Provider 
        value={{
          isOpen: state.isOpen,
          setIsOpen: state.setIsOpen,
          popUpId: ids.content,
          triggerId: ids.trigger,
          triggerRef,
          setTriggerRef,
        }}
      >
        {children}
      </PopUpContext.Provider>
    </MultiSelectContext.Provider>
  );
}
