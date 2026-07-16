import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { Appearance } from 'react-native'
import { getTheme, themes, type ThemeMode } from '@helpwave/hightide-design'
import type { SimpleValueStore } from '@helpwave/hightide-utils/hooks'
import { useNativeKeyValueStore } from '../../hooks/useNativeKeyValueStore'
import { HightideConfigUtils } from '../hightide-config/HightideConfigUtils'
import type { SystemTheme, ThemeInformation } from './forward-exports'
import { useCreateThemeConfig } from './forward-exports'
import { ThemeContext, useTheme, type ThemeContextValue } from './ThemeContext'

export type ThemeProviderProps = PropsWithChildren & {
  store?: SimpleValueStore,
  theme?: string | null,
  systemTheme?: SystemTheme,
  fallbackTheme?: ThemeMode,
  supportedThemes?: readonly ThemeInformation[],
  onChangedTheme?: (theme: string) => void,
}

const resolveThemeMode = (theme: string): ThemeMode => {
  if (theme in themes) {
    return theme as ThemeMode
  }
  return 'light'
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

const useNativeSystemTheme = (enabled: boolean) => {
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
  store: storeProp,
  theme,
  fallbackTheme = 'light',
  systemTheme: systemThemeOverride,
  supportedThemes = HightideConfigUtils.defaultSupportedThemes,
  onChangedTheme,
}: ThemeProviderProps) => {
  const nativeStore = useNativeKeyValueStore()
  const store = storeProp ?? nativeStore
  const isHydrated = storeProp ? true : nativeStore.isHydrated
  const detectedSystemTheme = useNativeSystemTheme(systemThemeOverride === undefined)
  const systemTheme = systemThemeOverride ?? detectedSystemTheme

  const themeConfig = useCreateThemeConfig({
    store,
    fallbackTheme,
    supportedThemes,
    theme,
    systemTheme,
    onChangedTheme,
  })

  const value = useMemo((): ThemeContextValue => {
    const themeMode = resolveThemeMode(themeConfig.theme)

    return {
      preferredTheme: themeConfig.preferredTheme,
      setTheme: themeConfig.setTheme,
      supportedThemes: themeConfig.supportedThemes,
      themeMode,
      theme: getTheme(themeMode),
    }
  }, [
    themeConfig.preferredTheme,
    themeConfig.setTheme,
    themeConfig.supportedThemes,
    themeConfig.theme,
  ])

  if (!isHydrated) return null

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
