import type { PropsWithChildren } from 'react'
import type { ThemeMode } from '@helpwave/hightide-design'
import {
  ThemeContext,
  ThemeContextProvider,
  useTheme as useThemeBase,
  useMemoryKeyValueStore,
  type ThemeContextValue,
  type ThemeWithSystem,
} from '@helpwave/hightide-utils'

export type ThemeProviderProps = PropsWithChildren & {
  mode?: ThemeMode,
  theme?: ThemeWithSystem<ThemeMode>,
  systemTheme?: ThemeMode,
  fallbackTheme?: ThemeMode,
  onChangedTheme?: (theme: ThemeMode) => void,
}

export {
  ThemeContext,
}

export const useThemeMode = (): ThemeMode => useThemeBase<ThemeMode>().resolvedTheme

export const ThemeProvider = ({
  children,
  mode = 'light',
  fallbackTheme,
  ...rest
}: ThemeProviderProps) => {
  const store = useMemoryKeyValueStore()

  return (
    <ThemeContextProvider
      store={store}
      fallbackTheme={fallbackTheme ?? mode}
      {...rest}
    >
      {children}
    </ThemeContextProvider>
  )
}

export type { ThemeContextValue }
