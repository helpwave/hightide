import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { useBrowserKeyValueStore } from '@helpwave/hightide-utils/hooks'
import type { ThemeConfig as HightideThemeConfig } from '../hightide-config'
import { useHightideConfig } from '../hightide-config'
import { useWebSystemTheme } from '@/src/hooks/useWebSystemTheme'
import type { SystemTheme, ThemeInformation } from './forward-exports'
import { useCreateThemeConfig } from './forward-exports'
import { ThemeContext } from './ThemeContext'

export type ThemeProviderProps = PropsWithChildren & Partial<HightideThemeConfig> & {
  theme?: string | null,
  systemTheme?: SystemTheme,
  supportedThemes?: readonly ThemeInformation[],
  onChangedTheme?: (theme: string) => void,
}

export const ThemeProvider = ({
  children,
  theme,
  initialTheme,
  supportedThemes,
  systemTheme: systemThemeOverride,
  onChangedTheme,
}: ThemeProviderProps) => {
  const { config } = useHightideConfig()
  const store = useBrowserKeyValueStore()
  const detectedSystemTheme = useWebSystemTheme()
  const systemTheme = systemThemeOverride ?? detectedSystemTheme
  const resolvedSupportedThemes = supportedThemes ?? config.theme.supportedThemes

  const value = useCreateThemeConfig({
    store,
    fallbackTheme: initialTheme ?? config.theme.initialTheme,
    supportedThemes: resolvedSupportedThemes,
    theme,
    systemTheme,
    onChangedTheme,
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', value.theme)
  }, [value.theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
