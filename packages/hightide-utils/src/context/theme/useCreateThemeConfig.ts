import { useCallback, useEffect, useMemo } from 'react'
import { useEventCallbackStabilizer } from '../../hooks/useEventCallbackStabelizer'
import type { SimpleValueStore } from '../../hooks/useSimpleStoreSyncedValue'
import { useSimpleStoreSyncedValue } from '../../hooks/useSimpleStoreSyncedValue'
import type { Locale } from '../localization/LocalizationContext'

export type SystemTheme = 'dark' | 'light'

export type ThemeMode = SystemTheme | string

export type ThemeInformation<T = unknown> = {
  nameTranslations: Record<Locale, string>,
  theme: T,
}

export type SupportedThemesConfig<T> =  Record<SystemTheme, ThemeInformation<T>> & Record<ThemeMode, ThemeInformation<T>>

export type ThemeConfigValue<T> = {
  themeMode: ThemeMode,
  preferredThemeMode: ThemeMode | null,
  setTheme: (theme: ThemeMode | null) => void,
  supportedThemes: SupportedThemesConfig<T>,
  theme: T,
}

export type UseCreateThemeConfigProps<T> = {
  store: SimpleValueStore,
  fallbackTheme: ThemeMode,
  supportedThemes: SupportedThemesConfig<T>,
  theme?: ThemeMode | null,
  systemTheme?: SystemTheme,
  onChangedTheme?: (theme: ThemeMode) => void,
}

export const useCreateThemeConfig = <T>({
  store,
  fallbackTheme,
  supportedThemes,
  theme,
  systemTheme,
  onChangedTheme,
}: UseCreateThemeConfigProps<T>): ThemeConfigValue<T> => {
  if(Object.keys(supportedThemes).length === 0) {
    throw new Error('useCreateThemeConfig: supportedThemes must contain at least one theme')
  }

  const {
    value: storedTheme,
    setValue: setStoredTheme,
    deleteValue: deleteStoredTheme,
  } = useSimpleStoreSyncedValue<string>({
    store,
    key: 'theme',
    decode: useCallback((value: string) => {
      if (supportedThemes[value]) return value
      return null
    }, [supportedThemes]),
    encode: useCallback((value) => value, []),
  })

  const preferredThemeMode = useMemo((): string | null => {
    if (theme !== undefined) {
      return theme
    }
    return storedTheme
  }, [storedTheme, theme])

  const resolvedThemeMode = useMemo(() => {
    if (preferredThemeMode !== null && supportedThemes[preferredThemeMode]) {
      return preferredThemeMode
    }
    if (systemTheme && supportedThemes[systemTheme]) {
      return systemTheme
    }
    if(supportedThemes[fallbackTheme]) {
      console.log('useCreateThemeConfig: fallbackTheme not found in the supported themes')
      return fallbackTheme
    }
    return Object.keys(supportedThemes)[0]
  }, [fallbackTheme, preferredThemeMode, supportedThemes, systemTheme])

  const resolvedTheme: T = useMemo(() => supportedThemes[resolvedThemeMode].theme, [resolvedThemeMode, supportedThemes])

  useEffect(() => {
    if (theme === undefined) return
    if (theme === null) {
      deleteStoredTheme()
    } else if (supportedThemes[theme]) {
      setStoredTheme(theme)
    }
  }, [deleteStoredTheme, setStoredTheme, supportedThemes, theme])

  const onChangeRef = useEventCallbackStabilizer(onChangedTheme)

  useEffect(() => {
    onChangeRef?.(resolvedThemeMode)
  }, [onChangeRef, resolvedThemeMode])

  const setTheme = useCallback((newTheme: string | null) => {
    if (theme !== undefined) {
      console.warn(
        'useCreateThemeConfig: Attempting to change the theme while setting a fixed theme won\'t have any effect. '
          + 'Change the theme provided to the ThemeProvider instead.'
      )
      return
    }
    if (newTheme === null) {
      deleteStoredTheme()
      return
    }
    if (!supportedThemes[newTheme]) return
    setStoredTheme(newTheme)
  }, [deleteStoredTheme, setStoredTheme, supportedThemes, theme])

  return {
    theme: resolvedTheme,
    preferredThemeMode: preferredThemeMode,
    themeMode: resolvedThemeMode,
    setTheme,
    supportedThemes,
  }
}
