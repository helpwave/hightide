import type { PropsWithChildren } from 'react'
import { ThemeContext } from './ThemeContext'
import type { UseCreateThemeContextProps } from './useCreateThemeContext'
import { useCreateThemeContext } from './useCreateThemeContext'

export type ThemeContextProviderProps =
  PropsWithChildren & UseCreateThemeContextProps

export const ThemeContextProvider = ({
  children,
  ...themeProps
}: ThemeContextProviderProps) => {
  const value = useCreateThemeContext(themeProps)

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
