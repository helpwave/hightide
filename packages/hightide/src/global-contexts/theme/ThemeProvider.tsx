import type { PropsWithChildren } from 'react'
import { useEffect, useMemo } from 'react'
import { useBrowserKeyValueStore } from '@helpwave/hightide-utils/hooks'
import type { ThemeConfig as HightideThemeConfig } from '@/src/global-contexts/hightide-config/HightideConfigContext'
import { useHightideConfig } from '@/src/global-contexts/hightide-config/HightideConfigContext'
import { useWebSystemTheme } from '@/src/hooks/useWebSystemTheme'
import type {
  ThemeMode,
  SupportedThemesConfig as SupportedThemesConfigBase,
  ThemeInformation as ThemeInformationBase,
  SystemTheme
} from '@helpwave/hightide-utils/context/theme'
import { useCreateThemeConfig } from '@helpwave/hightide-utils/context/theme'
import { ThemeContext } from '@/src/global-contexts/theme/ThemeContext'

export type ThemeInformation = Omit<ThemeInformationBase<unknown>, 'theme'> & { theme?: unknown }
export type SupportedThemesConfig = Record<SystemTheme, ThemeInformation> & Record<string, ThemeInformation>

export type ThemeProviderProps = PropsWithChildren & Partial<HightideThemeConfig> & {
  theme?: ThemeMode | null,
  supportedThemes?: SupportedThemesConfig,
  onChangedTheme?: (theme: string) => void,
}

export const ThemeProvider = ({
  children,
  theme,
  initialTheme,
  supportedThemes,
  onChangedTheme,
}: ThemeProviderProps) => {
  const { config } = useHightideConfig()
  const store = useBrowserKeyValueStore()
  const systemTheme = useWebSystemTheme()
  const resolvedSupportedThemes = supportedThemes ?? config.theme.supportedThemes
  const mappedSupportedThemes = useMemo(() => {
    const result: SupportedThemesConfigBase<unknown> = {
      light: {
        ...resolvedSupportedThemes.light,
        theme: resolvedSupportedThemes.light.theme ?? undefined,
      },
      dark: {
        ...resolvedSupportedThemes.dark,
        theme: resolvedSupportedThemes.light.theme ?? undefined,
      }
    }
    for(const themeMode in resolvedSupportedThemes) {
      const info = resolvedSupportedThemes[themeMode]
      result[themeMode] = {
        ...info,
        theme: info?.theme ?? undefined,
      }
    }
    return result
  }, [resolvedSupportedThemes])

  const value = useCreateThemeConfig({
    store,
    fallbackTheme: initialTheme ?? config.theme.initialTheme,
    supportedThemes: mappedSupportedThemes,
    theme,
    systemTheme,
    onChangedTheme,
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', value.themeMode)
  }, [value.themeMode])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
