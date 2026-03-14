import { useControlledState } from '@/src/hooks/useControlledState'
import { useCallback, useMemo } from 'react'

export interface UseMultiSelectionOption {
  id: string,
  disabled?: boolean,
}

export interface UseMultiSelectionOptions {
  options: ReadonlyArray<UseMultiSelectionOption>,
  value?: ReadonlyArray<string>,
  onSelectionChange?: (selection: ReadonlyArray<string>) => void,
  initialSelection?: ReadonlyArray<string>,
  isControlled?: boolean,
}

export interface UseMultiSelectionReturn {
  selection: ReadonlyArray<string>,
  setSelection: (selection: ReadonlyArray<string>) => void,
  toggleSelection: (id: string) => void,
  isSelected: (id: string) => boolean,
}

export function useMultiSelection({
  options: optionsList,
  value,
  onSelectionChange,
  initialSelection = [],
  isControlled,
}: UseMultiSelectionOptions): UseMultiSelectionReturn {
  const [selection, setSelection] = useControlledState({
    value,
    onValueChange: onSelectionChange,
    defaultValue: [...initialSelection],
    isControlled,
  })

  const isSelected = useCallback((id: string) => selection.includes(id), [selection])

  const toggleSelection = useCallback(
    (id: string) => {
      const option = optionsList.find((o) => o.id === id)
      if (!option || option.disabled) return
      setSelection((prev) =>
        prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
    },
    [optionsList, setSelection]
  )

  const setSelectionValue = useCallback(
    (next: ReadonlyArray<string>) => setSelection(Array.from(next)),
    [setSelection]
  )

  return useMemo(
    () => ({
      selection,
      setSelection: setSelectionValue,
      toggleSelection,
      isSelected,
    }),
    [selection, setSelectionValue, toggleSelection, isSelected]
  )
}
