import { useControlledState } from "@/src/hooks/useControlledState";
import { useCallback, useMemo } from "react";

export interface UseMultiSelectionOption {
  id: string;
  disabled?: boolean;
}

export interface UseMultiSelectionOptions<T> {
  options: ReadonlyArray<UseMultiSelectionOption>;
  value?: ReadonlyArray<T>;
  onSelectionChange: (selection: ReadonlyArray<T>) => void;
  initialSelection?: ReadonlyArray<T>;
  isControlled?: boolean;
  compareOptions?: (a: T, b: T) => boolean;
}

export interface MultiSelectionReturn<T> {
  selection: ReadonlyArray<T>;
  selectedOptions: ReadonlyArray<UseMultiSelectionOption>;
  options: ReadonlyArray<UseMultiSelectionOption>;
  setSelection: (selection: ReadonlyArray<T>) => void;
  toggleSelection: (value: T) => void;
  isSelected: (value: T) => boolean;
}

export function useMultiSelection<T>({
  options: optionsList,
  value,
  onSelectionChange,
  initialSelection = [],
  isControlled,
  compareOptions,
}: UseMultiSelectionOptions<T>): MultiSelectionReturn<T> {
  const [selection, setSelection] = useControlledState({
    value: value as T[] | undefined,
    onValueChange: onSelectionChange as (v: T[]) => void,
    defaultValue: [...initialSelection],
    isControlled,
  });

  const compare = useMemo(() => compareOptions ?? Object.is, [compareOptions]);

  const selectedOptions = useMemo(() => selection
    .map((s) => optionsList.find((o) => compare(o.id, s)))
    .filter((o): o is UseMultiSelectionOption => o != null)
  , [selection, optionsList, compare]);

  const isSelected = useCallback(
    (value: T) => selection.some((s) => compare(s, value)),
    [selection, compare]
  );

  const toggleSelection = useCallback((value: T) => {
    const option = optionsList.find((o) => compare(o.id, value));
    if (!option || option.disabled) return;
    setSelection((prev) => prev.some((s) => compare(s, value))
      ? prev.filter((s) => !compare(s, value))
      : [...prev, value]);
  }, [optionsList, compare, setSelection]);

  const setSelectionValue = useCallback(
    (next: ReadonlyArray<T>) => setSelection(Array.from(next)),
    [setSelection]
  );

  return useMemo(
    () => ({
      selection,
      selectedOptions,
      options: optionsList,
      setSelection: setSelectionValue,
      toggleSelection,
      isSelected,
    }),
    [
      selection,
      selectedOptions,
      optionsList,
      setSelectionValue,
      toggleSelection,
      isSelected,
    ]
  );
}
