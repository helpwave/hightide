import { createContext } from 'react'
import type { LocalizationContextValue } from './types'

export const LocalizationContext = createContext<LocalizationContextValue<string> | null>(null)
