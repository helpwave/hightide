import { createContext, useContext } from 'react'
import type { InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { TextInputEvent, TextInputState } from './TextInputState'

export type TextInputContextValue = InputContextValue<TextInputState, TextInputEvent>

export const TextInputContext = createContext<TextInputContextValue | null>(null)

export function useTextInputContext(): TextInputContextValue {
  const context = useContext(TextInputContext)
  if (!context) throw new Error('useTextInputContext must be used inside a TextInput.StateManager')
  return context
}
