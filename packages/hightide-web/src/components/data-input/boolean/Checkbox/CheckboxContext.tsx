import { createContext, useContext } from 'react'
import type { InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { CheckboxEvent, CheckboxState } from './CheckboxState'

export type CheckboxContextValue = InputContextValue<CheckboxState, CheckboxEvent>

export const CheckboxContext = createContext<CheckboxContextValue | null>(null)

export function useCheckboxContext(): CheckboxContextValue {
  const context = useContext(CheckboxContext)
  if (!context) throw new Error('useCheckboxContext must be used inside a Checkbox.StateManager')
  return context
}
