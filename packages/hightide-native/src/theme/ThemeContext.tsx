import { useEffect, useState, type PropsWithChildren } from 'react'
import { Appearance } from 'react-native'
import type { ThemeMode } from '@helpwave/hightide-design'
import {
  ThemeContext,
  ThemeContextProvider,
  useTheme as useThemeBase,
  type SimpleValueStore,
  type SystemTheme,
  type ThemeContextValue,
  type ThemeInformation
} from '@helpwave/hightide-utils'
import { useNativeKeyValueStore } from '../hooks/useNativeKeyValueStore'

export const nativeSupportedThemes: readonly ThemeInformation[] = [
  {
    theme: 'light',
    nameTranslations: {
      'de-DE': 'Hell',
      'en-US': 'Light',
    },
  },
  {
    theme: 'dark',
    nameTranslations: {
      'de-DE': 'Dunkel',
      'en-US': 'Dark',
    },
  },
  {
    theme: 'system',
    nameTranslations: {
      'de-DE': 'System',
      'en-US': 'System',
    },
  },
]

export type ThemeProviderProps = PropsWithChildren & {
  store?: SimpleValueStore,
  theme?: string,
  systemTheme?: SystemTheme,
  fallbackTheme?: ThemeMode,
  supportedThemes?: readonly ThemeInformation[],
  onChangedTheme?: (theme: string) => void,
}

export {
  ThemeContext,
}

export const useTheme = (): ThemeContextValue => useThemeBase()

export const useThemeMode = (): ThemeMode => {
  const { theme } = useTheme()
  return theme === 'dark' ? 'dark' : 'light'
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
  supportedThemes = nativeSupportedThemes,
  ...rest
}: ThemeProviderProps) => {
  const nativeStore = useNativeKeyValueStore()
  const store = storeProp ?? nativeStore
  const isHydrated = storeProp ? true : nativeStore.isHydrated
  const detectedSystemTheme = useNativeSystemTheme(systemThemeOverride === undefined)
  const systemTheme = systemThemeOverride ?? detectedSystemTheme

  if (!isHydrated) return null

  return (
    <ThemeContextProvider
      store={store}
      fallbackTheme={fallbackTheme}
      supportedThemes={supportedThemes}
      theme={theme}
      systemTheme={systemTheme}
      {...rest}
    >
      {children}
    </ThemeContextProvider>
  )
}

export type { ThemeContextValue }
