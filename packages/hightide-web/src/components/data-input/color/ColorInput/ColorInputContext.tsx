import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { ColorInputEvent, ColorInputState } from './ColorInputState'

export type ColorInputConfig = DOMInputConfig & {
  hasAlpha: boolean,
  isCapitalized: boolean,
}

export type ColorInputContextValue = DOMInputContextValue<ColorInputState, ColorInputEvent, ColorInputConfig>

export const ColorInputContext = createContext<ColorInputContextValue | null>(null)

export function useColorInputContext(): ColorInputContextValue {
  const context = useContext(ColorInputContext)
  if (!context) throw new Error('useColorInputContext must be used inside a ColorInput.StateManager')
  return context
}
