import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { useBrowserKeyValueStore } from '@helpwave/hightide-utils/hooks'
import type { ThemeConfig as HightideThemeConfig } from '@/src/global-contexts/hightide-config/HightideConfigContext'
import { useHightideConfig } from '@/src/global-contexts/hightide-config/HightideConfigContext'
import { useWebSystemTheme } from '@/src/hooks/useWebSystemTheme'
import type { SystemTheme, ThemeInformation } from '@helpwave/hightide-utils/context/theme'
import { useCreateThemeConfig } from '@helpwave/hightide-utils/context/theme'
import { ThemeContext } from '@/src/global-contexts/theme/ThemeContext'

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
