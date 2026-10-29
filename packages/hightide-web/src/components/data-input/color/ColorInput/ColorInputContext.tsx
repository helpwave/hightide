import { createContext, useContext } from 'react'
import type { InputConfig, InputContextValue } from '@helpwave/hightide-utils/interfaces'
import type { ColorInputEvent, ColorInputState } from './ColorInputState'

export type ColorInputConfig = InputConfig & {
  hasAlpha: boolean,
  isCapitalized: boolean,
}

export type ColorInputContextValue = InputContextValue<ColorInputState, ColorInputEvent, ColorInputConfig>

export const ColorInputContext = createContext<ColorInputContextValue | null>(null)

export function useColorInputContext(): ColorInputContextValue {
  const context = useContext(ColorInputContext)
  if (!context) throw new Error('useColorInputContext must be used inside a ColorInput.StateManager')
  return context
}
