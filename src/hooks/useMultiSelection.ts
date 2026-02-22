import type { SelectionOption } from "@/src/hooks/useSingleSelection";
import { useControlledState } from "@/src/hooks/useControlledState";
import { useCallback, useMemo } from "react";

export interface UseMultiSelectionOptions<T> {
  options: ReadonlyArray<SelectionOption<T>>;
  value?: ReadonlyArray<T>;
  onSelectionChange: (selection: ReadonlyArray<T>) => void;
  initialSelection?: ReadonlyArray<T>;
  isControlled?: boolean;
  compareOptions?: (a: T, b: T) => boolean;
}

export interface MultiSelectionReturn<T> {
  selection: ReadonlyArray<T>;
  selectedOptions: ReadonlyArray<SelectionOption<T>>;
  options: ReadonlyArray<SelectionOption<T>>;
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

  const selectedOptions = useMemo(
    () =>
      selection
        .map((s) => optionsList.find((o) => compare(o.value, s)))
        .filter((o): o is SelectionOption<T> => o != null),
    [selection, optionsList, compare]
  );

  const isSelected = useCallback(
    (value: T) => selection.some((s) => compare(s, value)),
    [selection, compare]
  );

  const toggleSelection = useCallback(
    (value: T) => {
      const option = optionsList.find((o) => compare(o.value, value));
      if (!option || option.disabled) return;
      setSelection((prev) => {
        const next = prev.some((s) => compare(s, value))
          ? prev.filter((s) => !compare(s, value))
          : [...prev, value];
        return next;
      });
    },
    [optionsList, compare, setSelection]
  );

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
