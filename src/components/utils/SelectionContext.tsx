import { useControlledState } from "@/src/hooks/useControlledState";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

export interface SelectionOption<T> {
  value: T,
  label: string,
  display: ReactNode,
  disabled: boolean,
}

//
// Single Selection Context
//

export interface SingleSelectionContextType<T> {
  selection: T | null,
  selectedOption: SelectionOption<T> | null;
  options: ReadonlyArray<SelectionOption<T>>;
  changeSelection: (selection: T) => void;
  registerOption: (option: SelectionOption<T>) => () => void;
}

export const SingleSelectionContext = createContext<SingleSelectionContextType<any> | null>(null);

export function useSingleSelectionContext<T>(): SingleSelectionContextType<T> | null {
  const context = useContext(SingleSelectionContext);
  if (!context) {
    throw new Error('useSingleSelectionContext must be used within a SingleSelectionProvider');
  }
  return context as SingleSelectionContextType<T>;
}

export interface SingleSelectionProviderProps<T> {
  children: ReactNode,
  value: T | null,
  onSelectionChange: (selection: T) => void,
  initialSelection: T | null,
  isControlled: boolean,
  compareOptions?: (option1: T, option2: T) => boolean,
}

export function SingleSelectionProvider<T>({ 
  children,
  value, 
  onSelectionChange,
  initialSelection, 
  isControlled, 
  compareOptions 
}: SingleSelectionProviderProps<T>) {
  const [options, setOptions] = useState<SelectionOption<T>[]>([])
  const [selection, setSelection] = useControlledState({
    value,
    onValueChange: onSelectionChange,
    defaultValue: initialSelection,
    isControlled: isControlled,
  });

  const compareFunction = useMemo(() => {
    return compareOptions ? compareOptions : Object.is;
  }, [compareOptions]);

  const selectedOption = useMemo(() => {
    if (!selection) return null;
    return options.find(option => compareFunction(option.value, selection));
  }, [options, selection]);

  const registerOption = useCallback((option: SelectionOption<T>) => {
    setOptions(prev => [...prev, option])
    return () => {
      setOptions(prev => prev.filter(o => !compareFunction(o.value, option.value)));
    }
  }, [setOptions, compareFunction]);

  const changeSelection = useCallback((selection: T) => {
    const option = options.find(option => compareFunction(option.value, selection));
    if(!option || option.disabled) return;
    setSelection(selection);
  }, [setSelection, compareFunction]);

  return (
    <SingleSelectionContext.Provider 
      value={useMemo(() => ({ 
        selection, 
        selectedOption,
        options,
        changeSelection, 
        registerOption 
      }), [selection, selectedOption, options, setSelection, registerOption])}
    >
      {children}
    </SingleSelectionContext.Provider>
  );
}

//
// Multi Selection Context
//

export interface MultiSelectionContextType<T> {
  selection: ReadonlyArray<T>;
  selectedOptions: ReadonlyArray<SelectionOption<T>>;
  options: ReadonlyArray<SelectionOption<T>>;
  setSelection: (selection: ReadonlyArray<T>) => void;
  toggleSelection: (value: T) => void;
  isSelected: (value: T) => boolean;
  registerOption: (option: SelectionOption<T>) => () => void;
}

export const MultiSelectionContext = createContext<MultiSelectionContextType<any> | null>(null);

export function useMultiSelectionContext<T>(): MultiSelectionContextType<T> {
  const context = useContext(MultiSelectionContext);
  if (!context) {
    throw new Error('useMultiSelectionContext must be used within a MultiSelectionProvider');
  }
  return context as MultiSelectionContextType<T>;
}

export interface MultiSelectionProviderProps<T> {
  children: ReactNode;
  value?: ReadonlyArray<T>;
  onSelectionChange: (selection: ReadonlyArray<T>) => void;
  initialSelection?: ReadonlyArray<T>;
  compareOptions?: (option1: T, option2: T) => boolean;
}

export function MultiSelectionProvider<T>({
  children,
  value,
  onSelectionChange,
  initialSelection = [],
  compareOptions,
}: MultiSelectionProviderProps<T>) {
  const [options, setOptions] = useState<SelectionOption<T>[]>([]);
  const [selection, setSelection] = useControlledState({
    value: value as T[] | undefined,
    onValueChange: onSelectionChange as (v: T[]) => void,
    defaultValue: initialSelection,
  });

  const compareFunction = useMemo(() => (compareOptions ?? Object.is), [compareOptions]);

  const selectedOptions = useMemo(() =>
    selection
      .map((s) => options.find((o) => compareFunction(o.value, s)))
      .filter((o): o is SelectionOption<T> => o != null)
  ,[options, selection, compareFunction]);

  const isSelected = useCallback(
    (value: T) => selection.some((s) => compareFunction(s, value)),
    [selection, compareFunction]
  );

  const registerOption = useCallback(
    (option: SelectionOption<T>) => {
      setOptions((prev) => [...prev, option]);
      return () => setOptions((prev) => prev.filter((o) => !compareFunction(o.value, option.value)));
    },
    [compareFunction]
  );

  const toggleSelection = useCallback(
    (value: T) => {
      const option = options.find((o) => compareFunction(o.value, value));
      if (!option || option.disabled) return;
      setSelection((prev) => {
        const next = prev.some((s) => compareFunction(s, value))
          ? prev.filter((s) => !compareFunction(s, value))
          : [...prev, value];
        return next;
      });
    },
    [options, compareFunction, setSelection]
  );

  const setSelectionValue = useCallback(
    (next: ReadonlyArray<T>) => setSelection(Array.from(next)),
    [setSelection]
  );

  const contextValue = useMemo(() => ({
    selection,
    selectedOptions,
    options,
    setSelection: setSelectionValue,
    toggleSelection,
    isSelected,
    registerOption,
  }), [selection, selectedOptions, options, setSelectionValue, toggleSelection, isSelected, registerOption]);

  return (
    <MultiSelectionContext.Provider value={contextValue}>
      {children}
    </MultiSelectionContext.Provider>
  );
}