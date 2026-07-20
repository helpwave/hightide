import { createContext, useContext } from 'react'

export type HightideContextValue = {
  isLocalizationInitialized: boolean,
  isThemeInitialized: boolean,
}

export const HightideContext = createContext<HightideContextValue | null>(null)

export const useHightide = (): HightideContextValue => {
  const context = useContext(HightideContext)
  if (!context) {
    throw new Error(
      'useHightide must be used within HightideContext. Try adding a HightideProvider around your app.'
    )
  }
  return context
}
