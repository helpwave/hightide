import { createContext, useContext, type ReactNode } from 'react'
import type { ThemeMode } from '@helpwave/hightide-design'

type ThemeContextValue = {
  mode: ThemeMode,
}

const ThemeContext = createContext<ThemeContextValue>({ mode: 'light' })

export type ThemeProviderProps = {
  mode?: ThemeMode,
  children: ReactNode,
}

export const ThemeProvider = ({
  mode = 'light',
  children,
}: ThemeProviderProps) => {
  return (
    <ThemeContext.Provider value={{ mode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeMode = (): ThemeMode => {
  return useContext(ThemeContext).mode
}
