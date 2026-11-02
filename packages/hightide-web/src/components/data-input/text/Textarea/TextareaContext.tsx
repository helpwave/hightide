import { createContext, useContext } from 'react'
import type { DOMInputContextValue } from '../../domInput'
import type { TextareaEvent, TextareaState } from './TextareaState'

export type TextareaContextValue = DOMInputContextValue<TextareaState, TextareaEvent>

export const TextareaContext = createContext<TextareaContextValue | null>(null)

export function useTextareaContext(): TextareaContextValue {
  const context = useContext(TextareaContext)
  if (!context) throw new Error('useTextareaContext must be used inside a Textarea.StateManager')
  return context
}
