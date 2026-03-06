import type { ReactNode, RefObject } from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { SelectContext } from "./SelectContext";
import type { SelectContextConfig, SelectContextLayout, SelectOptionType } from "./SelectContext";
import { useSelect } from "./useSelect";
import { DOMUtils } from "@/src/utils/dom";
import { FormFieldDataHandling } from "../../form/FormField";
import { useEventCallbackStabilizer } from "@/src/hooks/useEventCallbackStabelizer";
import { FormFieldInteractionStates } from "../../form/FieldLayout";
import { PopUpContext } from "@/src/components/layout/popup/PopUpContext";

export interface SelectIds {
  trigger: string;
  content: string;
  listbox: string;
  searchInput: string;
}

export interface SelectRootProps<T> extends Partial<FormFieldDataHandling<T>>, Partial<FormFieldInteractionStates> {
  value?: T | null;
  initialValue?: T | null;
  compareFunction?: (a: T | null, b: T | null) => boolean;
  initialIsOpen?: boolean;
  onClose?: () => void;
  onIsOpenChange?: (isOpen: boolean) => void;
  showSearch?: boolean;
  iconAppearance?: "left" | "right" | "none";
  children: ReactNode;
}

export function SelectRoot<T>({
  children,
  value,
  onValueChange,
  onEditComplete,
  initialValue,
  compareFunction,
  initialIsOpen = false,
  onClose,
  onIsOpenChange,
  showSearch = true,
  iconAppearance = "right",
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
}: SelectRootProps<T>) {
  const [triggerRef, setTriggerRef] = useState<RefObject<HTMLElement> | null>(null);
  const [options, setOptions] = useState<SelectOptionType<T>[]>([]);
  const generatedId = useId();
  const [ids, setIds] = useState<SelectIds>({
    trigger: "select-" + generatedId,
    content: "select-content-" + generatedId,
    listbox: "select-listbox-" + generatedId,
    searchInput: "select-search-" + generatedId,
  });
  

  const registerOption = useCallback(
    (item: SelectOptionType<T>) => {
      setOptions((prev) => {
        const next = prev.filter((o) => o.value !== item.value);
        next.push(item);
        next.sort((a, b) =>
          DOMUtils.compareDocumentPosition(a.ref.current, b.ref.current)
        );
        return next;
      });
      return () =>
        setOptions((prev) => prev.filter((o) => o.value !== item.value));
    },
    []
  );

  const registerTrigger = useCallback((ref: RefObject<HTMLElement>) => {
    setTriggerRef(ref);
    return () => {
      setTriggerRef(null);
    };
  }, []);

  const compare = useMemo(() => compareFunction ?? Object.is, [compareFunction]);

  const idToOptionMap = useMemo(() => {
    return options.reduce((acc, o) => {
      acc[o.id] = o;
      return acc;
    }, {} as Record<string, SelectOptionType<T>>);
  }, [options]);

  const mappedValueId = useMemo(() => {
    if(value === undefined) return undefined;
    return options.find((o) => compare(o.value, value))?.id ?? null;
  }, [options, value, compare]);

  const mappedInitialValueId = useMemo(() => {
    if(initialValue === undefined) return undefined;
    return options.find((o) => compare(o.value, initialValue))?.id ?? null;
  }, [options, initialValue, compare]);

  const onValueChangeStable = useEventCallbackStabilizer(onValueChange);
  const onEditCompleteStable = useEventCallbackStabilizer(onEditComplete);
  const onIsOpenChangeStable = useEventCallbackStabilizer(onIsOpenChange);

  const onValueChangeWrapper = useCallback((value: string) => {
    const option = idToOptionMap[value]
    if(option === undefined) {
      console.warn(`Attempted to select an option ${value} that is not valid`);
      return;
    }
    onValueChangeStable(option.value);
  }, [onValueChangeStable, idToOptionMap]);

  const onEditCompleteWrapper = useCallback((value: string) => {
    const option = idToOptionMap[value]
    if(option === undefined) {
      console.warn(`Attempted to edit complete an option ${value} that is not valid`);
      return;
    }
    onEditCompleteStable(option.value);
  }, [onEditCompleteStable, idToOptionMap]);


  const state = useSelect({
    value: mappedValueId,
    initialValue: mappedInitialValueId,
    onValueChange: onValueChangeWrapper, 
    onEditComplete: onEditCompleteWrapper,
    options,
    initialIsOpen,
    onClose,
    onIsOpenChange: onIsOpenChangeStable,
  });

  useEffect(() => {
    if(showSearch === false) {
      state.setSearchQuery("");
    }
  }, [showSearch]);

  const config: SelectContextConfig = useMemo(() => ({
    iconAppearance,
    ids,
    setIds,
  }), [iconAppearance, ids, setIds]);

  const layout: SelectContextLayout = useMemo(() => ({
    triggerRef,
    registerTrigger,
  }), [triggerRef, registerTrigger]);

  return (
    <SelectContext.Provider
      value={{
        invalid,
        disabled,
        readOnly,
        required,
        selectedId: state.value,
        highlightedId: state.highlightedValue,
        isOpen: state.isOpen,
        options,
        visibleOptionIds: state.visibleOptionIds,
        idToOptionMap,
        registerOption,
        toggleSelection: state.selectValue,
        highlightFirst: state.highlightFirst,
        highlightLast: state.highlightLast,
        highlightNext: state.highlightNext,
        highlightPrevious: state.highlightPrevious,
        highlightItem: state.highlightItem,
        handleTypeaheadKey: state.handleTypeaheadKey,
        setIsOpen: state.setIsOpen,
        toggleIsOpen: state.toggleOpen,
        config,
        layout,
        search: {
          hasSearch: showSearch,
          searchQuery: state.searchQuery,
          setSearchQuery: state.setSearchQuery,
        },
      }}
    >
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
    </SelectContext.Provider>
  );
}
