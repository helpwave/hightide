import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import type {
  SystemTheme
} from '@helpwave/hightide-utils'
import {
  ThemeContext,
  ThemeContextProvider,
  useTheme as useThemeBase,
  useBrowserKeyValueStore,
  type ThemeContextValue,
  type ThemeInformation
} from '@helpwave/hightide-utils'
import type { ThemeConfig } from '@/src/global-contexts/HightideConfigContext'
import { useHightideConfig } from '@/src/global-contexts/HightideConfigContext'

export type { ThemeInformation }

export {
  ThemeContext,
}

export const useTheme = (): ThemeContextValue => useThemeBase()

export type ThemeProviderProps = PropsWithChildren & Partial<ThemeConfig> & {
  theme?: string,
  systemTheme?: string,
  supportedThemes?: readonly ThemeInformation[],
}

const detectWebSystemTheme = (): SystemTheme | undefined => {
  if (typeof window === 'undefined') return undefined
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return undefined
}

const useWebSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState<SystemTheme | undefined>(
    () => (detectWebSystemTheme())
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

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
  }, [])

  return systemTheme
}

const ThemeDocumentSync = () => {
  const { theme } = useTheme()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return null
}

export const ThemeProvider = ({
  children,
  theme,
  initialTheme,
  supportedThemes,
}: ThemeProviderProps) => {
  const { config } = useHightideConfig()
  const store = useBrowserKeyValueStore()
  const detectedSystemTheme = useWebSystemTheme()
  const resolvedSupportedThemes = supportedThemes ?? config.theme.supportedThemes

  return (
    <ThemeContextProvider
      store={store}
      fallbackTheme={initialTheme ?? config.theme.initialTheme}
      supportedThemes={resolvedSupportedThemes}
      theme={theme}
      systemTheme={detectedSystemTheme}
    >
      <ThemeDocumentSync />
      {children}
    </ThemeContextProvider>
  )
}

export type { ThemeContextValue }
