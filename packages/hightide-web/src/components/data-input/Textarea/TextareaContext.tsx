import { createContext, useContext } from 'react'
import type { InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { TextareaEvent, TextareaState } from './TextareaState'

export type TextareaContextValue = InputContextValue<TextareaState, TextareaEvent>

export const TextareaContext = createContext<TextareaContextValue | null>(null)

export function useTextareaContext(): TextareaContextValue {
  const context = useContext(TextareaContext)
  if (!context) throw new Error('useTextareaContext must be used inside a Textarea.StateManager')
  return context
}
