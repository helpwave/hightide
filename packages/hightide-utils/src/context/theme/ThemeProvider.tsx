import type { PropsWithChildren } from 'react'
import { ThemeContext } from './ThemeContext'
import { useCreateThemeContext } from './useCreateThemeContext'
import type { ThemeContextValue, UseCreateThemeContextProps } from './types'

export type ThemeContextProviderProps<TResolvedTheme extends string> =
  PropsWithChildren & UseCreateThemeContextProps<TResolvedTheme>

export const ThemeContextProvider = <TResolvedTheme extends string>({
  children,
  ...themeProps
}: ThemeContextProviderProps<TResolvedTheme>) => {
  const value = useCreateThemeContext(themeProps)

  return (
    <ThemeContext.Provider value={value as ThemeContextValue<string>}>
      {children}
    </ThemeContext.Provider>
  )
}
