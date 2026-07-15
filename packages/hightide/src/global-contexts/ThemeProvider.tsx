import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import {
  ThemeContext,
  ThemeContextProvider,
  ThemeUtil,
  useTheme as useThemeBase,
  useBrowserKeyValueStore,
  type ResolvedTheme,
  type ThemeContextValue,
  type ThemeType,
  type ThemeWithSystem
} from '@helpwave/hightide-utils'
import type { ThemeConfig } from '@/src/global-contexts/HightideConfigContext'
import { useHightideConfig } from '@/src/global-contexts/HightideConfigContext'

export type { ResolvedTheme, ThemeType }
export { ThemeUtil }

export {
  ThemeContext,
}

export const useTheme = (): ThemeContextValue<ResolvedTheme> => useThemeBase<ResolvedTheme>()

export type ThemeProviderProps = PropsWithChildren & Partial<ThemeConfig> & {
  theme?: ThemeWithSystem<ResolvedTheme>,
  systemTheme?: ResolvedTheme,
}

const detectWebSystemTheme = (): ResolvedTheme | undefined => {
  if (typeof window === 'undefined') return undefined
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return undefined
}

const useWebSystemTheme = (enabled: boolean) => {
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme | undefined>(
    () => (enabled ? detectWebSystemTheme() : undefined)
  )

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const updateSystemTheme = () => {
      setSystemTheme(detectWebSystemTheme())
    }

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const lightQuery = window.matchMedia('(prefers-color-scheme: light)')
    const noPrefQuery = window.matchMedia('(prefers-color-scheme: no-preference)')

    darkQuery.addEventListener('change', updateSystemTheme)
    lightQuery.addEventListener('change', updateSystemTheme)
    noPrefQuery.addEventListener('change', updateSystemTheme)

    return () => {
      darkQuery.removeEventListener('change', updateSystemTheme)
      lightQuery.removeEventListener('change', updateSystemTheme)
      noPrefQuery.removeEventListener('change', updateSystemTheme)
    }
  }, [enabled])

  return systemTheme
}

const ThemeDocumentSync = () => {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme)
  }, [resolvedTheme])

  return null
}

export const ThemeProvider = ({
  children,
  theme,
  initialTheme,
  systemTheme: systemThemeOverride,
}: ThemeProviderProps) => {
  const { config } = useHightideConfig()
  const store = useBrowserKeyValueStore<unknown>()
  const detectedSystemTheme = useWebSystemTheme(systemThemeOverride === undefined && theme === undefined)
  const systemTheme = systemThemeOverride ?? detectedSystemTheme

  return (
    <ThemeContextProvider
      store={store}
      fallbackTheme={initialTheme ?? config.theme.initialTheme}
      theme={theme}
      systemTheme={systemTheme}
    >
      <ThemeDocumentSync />
      {children}
    </ThemeContextProvider>
  )
}

export type { ThemeContextValue }
