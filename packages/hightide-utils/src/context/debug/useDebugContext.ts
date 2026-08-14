import { useContext } from 'react'

import {
  DebugContext,
  defaultDebugContextValue,
  type DebugContextValue
} from './DebugContext'

export const useDebugContext = (): DebugContextValue => {
  const context = useContext(DebugContext)
  return context ?? defaultDebugContextValue
}
