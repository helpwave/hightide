import { useCallback, useMemo } from "react";
import { useControlledState } from "@/src/hooks/useControlledState";

export interface SelectionOption {
  id: string;
  disabled?: boolean;
}

export interface UseSingleSelectionOptions {
  options: ReadonlyArray<SelectionOption>;
  selection?: string | null;
  onSelectionChange?: (selection: string | null) => void;
  initialSelection?: string | null;
  isLooping?: boolean;
}

export interface SingleSelectionReturn {
  selection: string | null;
  selectedIndex: number | null;
  selectByIndex: (index: number) => void;
  selectValue: (value: string | null) => void;
  selectFirst: () => void;
  selectLast: () => void;
  selectNext: () => void;
  selectPrevious: () => void;
}

export function useSingleSelection({
  options: optionsList,
  selection: controlledSelection,
  onSelectionChange,
  initialSelection,
  isLooping = true,
}: UseSingleSelectionOptions): SingleSelectionReturn {
  const [selection, setSelection] = useControlledState({
    value: controlledSelection,
    onValueChange: onSelectionChange,
    defaultValue: initialSelection,
  });

  const selectedIndex = useMemo(() => {
    return optionsList.findIndex((o) => o.id === selection);
  }, [optionsList, selection]);

  const enabledOptions = useMemo(() => optionsList.filter((o) => !o.disabled), [optionsList]);

  const changeSelection = useCallback((next: string | null) => {
    const option = enabledOptions.find((o) => o.id === next);
    if(!option && next != null) {
      console.warn(`Attempted to select an option ${next} that is not valid or disabled`);
      return;
    }
    setSelection(option?.id ?? null);
  }, [enabledOptions, setSelection]);

  const selectByIndex = useCallback((index: number) => {
    const option = optionsList[index];
    if(!option || option.disabled || index < 0 || index >= optionsList.length) {
      console.warn(`Attempted to select an index ${index} that is not valid or disabled`);
      return;
    }
    setSelection(option.id);
  }, [optionsList, setSelection]);

  const selectFirst = useCallback(() => {
    if(enabledOptions.length === 0) return;
    const first = enabledOptions.find((o) => !o.disabled);
    setSelection(first?.id ?? null);
  }, [enabledOptions, setSelection]);

  const selectLast = useCallback(() => {
    if(enabledOptions.length === 0) return;
    const last = [...enabledOptions].reverse().find((o) => !o.disabled);
    setSelection(last?.id ?? null);
  }, [enabledOptions, setSelection]);

  const selectNext = useCallback(() => {
    if(enabledOptions.length === 0) return;
    let currentIndex = enabledOptions.findIndex((o) => o.id === selection);
    if(currentIndex === -1) currentIndex = 0;
    const nextIndex = isLooping ? (currentIndex + 1) % enabledOptions.length : Math.min(currentIndex + 1, enabledOptions.length - 1);
    setSelection(enabledOptions[nextIndex].id);
  }, [enabledOptions, selection, isLooping, setSelection]);

  const selectPrevious = useCallback(() => {
    if(enabledOptions.length === 0) return;
    let currentIndex = enabledOptions.findIndex((o) => o.id === selection);
    if(currentIndex === -1) currentIndex = enabledOptions.length;
    const previousIndex = isLooping ? (currentIndex - 1 + enabledOptions.length) % enabledOptions.length : Math.max(currentIndex - 1, 0);
    setSelection(enabledOptions[previousIndex].id);
  }, [enabledOptions, selection, isLooping, setSelection]);

  return useMemo(() => ({
    selection,
    selectedIndex,
    selectByIndex,
    selectValue: changeSelection,
    selectFirst,
    selectLast,
    selectNext,
    selectPrevious,
  }), [selection, selectedIndex, enabledOptions, changeSelection, selectFirst, selectLast, selectNext, selectPrevious]);
}
