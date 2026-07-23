import {
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from 'react'
import { Appearance } from 'react-native'

import type { SupportedThemesConfig } from '@helpwave/hightide-utils/context'

import { HightideConfigUtils } from '../hightide-config/HightideConfigUtils'
import {
  ThemeContext,
  useTheme,
  type ThemeContextValue
} from './ThemeContext'
import {
  useCreateThemeConfig,
  type SystemTheme
} from './forward-exports'
import { useNativeKeyValueStore } from '../../hooks/useNativeKeyValueStore'
import type { ThemeMode } from '../../theme/themes/nativeThemes'
import type { Theme } from '../../theme/types/theme'

export type ThemeProviderProps<T> = PropsWithChildren & {
  theme?: ThemeMode | null,
  fallbackTheme?: ThemeMode,
  supportedThemes?: SupportedThemesConfig<T>,
  onChangedTheme?: (themeMode: string) => void,
}

export const useThemeMode = (): ThemeMode => {
  return useTheme().themeMode
}

const detectNativeSystemTheme = (): SystemTheme | undefined => {
  const colorScheme = Appearance.getColorScheme()
  if (colorScheme === 'dark' || colorScheme === 'light') {
    return colorScheme
  }
  return undefined
}

const useNativeSystemTheme = (enabled: boolean = true) => {
  const [systemTheme, setSystemTheme] = useState<SystemTheme | undefined>(() =>
    (enabled ? detectNativeSystemTheme() : undefined))

  useEffect(() => {
    if (!enabled) return

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme === 'dark' || colorScheme === 'light') {
        setSystemTheme(colorScheme)
      }
    })

    return () => subscription.remove()
  }, [enabled])

  return systemTheme
}

export const ThemeProvider = ({
  children,
  theme,
  fallbackTheme = 'light',
  supportedThemes = HightideConfigUtils.defaultSupportedThemes,
  onChangedTheme,
}: ThemeProviderProps<Theme>) => {
  const store = useNativeKeyValueStore()
  const systemTheme = useNativeSystemTheme()

  const themeConfig = useCreateThemeConfig({
    store,
    fallbackTheme,
    supportedThemes,
    theme,
    systemTheme,
    onChangedTheme,
  })

  const contextValue = useMemo((): ThemeContextValue => {
    return {
      preferredThemeMode: themeConfig.preferredThemeMode,
      setTheme: themeConfig.setTheme,
      supportedThemes: themeConfig.supportedThemes,
      themeMode: themeConfig.themeMode,
      theme: themeConfig.theme,
      isInitialized: store.isInitialized,
    }
  }, [store.isInitialized, themeConfig.preferredThemeMode, themeConfig.setTheme, themeConfig.supportedThemes, themeConfig.theme, themeConfig.themeMode])

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}
