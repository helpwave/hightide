import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { useControlledState } from "@/src/hooks/useControlledState";

export interface SelectionOption<T> {
  value: T;
  label: string;
  display: ReactNode;
  disabled: boolean;
}

export interface UseSingleSelectionOptions<T> {
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
  registerOption: (option: SelectionOption<T>) => () => void;
}

export function useSingleSelection<T>(
  options: UseSingleSelectionOptions<T>
): SingleSelectionReturn<T> {
  const {
    value,
    onSelectionChange,
    initialSelection,
    isControlled,
    compareOptions,
  } = options;

  const [optionsList, setOptionsList] = useState<SelectionOption<T>[]>([]);
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

  const registerOption = useCallback(
    (option: SelectionOption<T>) => {
      setOptionsList((prev) => [...prev, option]);
      return () =>
        setOptionsList((prev) =>
          prev.filter((o) => !compare(o.value, option.value))
        );
    },
    [compare]
  );

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
      registerOption,
    }),
    [selection, selectedOption, optionsList, changeSelection, registerOption]
  );
}
