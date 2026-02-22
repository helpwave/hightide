import type { ReactNode } from "react";
import { useCallback, useMemo } from "react";
import { useControlledState } from "@/src/hooks/useControlledState";

export interface SelectionOption<T> {
  value: T;
  label: string;
  display: ReactNode;
  disabled: boolean;
}

export interface UseSingleSelectionOptions<T> {
  options: ReadonlyArray<SelectionOption<T>>;
  value: T | null | undefined;
  onSelectionChange: (selection: T) => void;
  initialSelection: T | null;
  isControlled?: boolean;
  compareOptions?: (a: T, b: T) => boolean;
}

export interface SingleSelectionReturn<T> {
  selection: T | null;
  selectedOption: SelectionOption<T> | null;
  options: ReadonlyArray<SelectionOption<T>>;
  changeSelection: (selection: T) => void;
}

export function useSingleSelection<T>({
  options: optionsList,
  value,
  onSelectionChange,
  initialSelection,
  isControlled,
  compareOptions,
}: UseSingleSelectionOptions<T>): SingleSelectionReturn<T> {
  const [selection, setSelection] = useControlledState({
    value: value ?? undefined,
    onValueChange: onSelectionChange,
    defaultValue: initialSelection,
    isControlled: isControlled ?? value !== undefined,
  });

  const compare = useMemo(() => compareOptions ?? Object.is, [compareOptions]);

  const selectedOption = useMemo(() => {
    if (selection == null) return null;
    return optionsList.find((o) => compare(o.value, selection)) ?? null;
  }, [optionsList, selection, compare]);

  const changeSelection = useCallback(
    (next: T) => {
      const option = optionsList.find((o) => compare(o.value, next));
      if (!option || option.disabled) return;
      setSelection(next);
    },
    [optionsList, compare, setSelection]
  );

  return useMemo(
    () => ({
      selection: selection ?? null,
      selectedOption,
      options: optionsList,
      changeSelection,
    }),
    [selection, selectedOption, optionsList, changeSelection]
  );
}
