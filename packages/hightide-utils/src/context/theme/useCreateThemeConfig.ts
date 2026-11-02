import { useCallback, useEffect, useMemo } from 'react'
import { useStableEvent } from '../../hooks/useStableEvent'
import type { SimpleValueStore } from '../../hooks/useSimpleStoreSyncedValue'
import { useSimpleStoreSyncedValue } from '../../hooks/useSimpleStoreSyncedValue'

export type SystemTheme = 'dark' | 'light'

export type ThemeMode = SystemTheme | string

export type ThemeInformation<T = unknown> = {
  name: string,
  isDark: boolean,
  translationKey?: string,
  nameTranslations?: Record<string, string>,
  theme?: T,
}

const hasThemeInformationLabelSource = (themeInformation: ThemeInformation): boolean => {
  if (themeInformation.translationKey) return true
  return themeInformation.nameTranslations !== undefined && Object.keys(themeInformation.nameTranslations).length > 0
}

export const ThemeUtils = {
  resolveThemeInformationLabel: (
    themeInformation: ThemeInformation,
    locale: string,
    translation: (key: string) => string,
  ): string => {
    if (themeInformation.translationKey) {
      return translation(themeInformation.translationKey)
    }
    return themeInformation.nameTranslations?.[locale]
      ?? themeInformation.nameTranslations?.['en-US']
      ?? themeInformation.name
  },
}

export type SupportedThemesConfig<T = unknown> = Record<SystemTheme, ThemeInformation<T>> & Record<ThemeMode, ThemeInformation<T>>

export type ThemeConfig<T = unknown> = {
  initialTheme: string,
  supportedThemes: SupportedThemesConfig<T>,
}

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

  useEffect(() => {
    for (const [themeMode, themeInformation] of Object.entries(supportedThemes)) {
      if (!hasThemeInformationLabelSource(themeInformation)) {
        console.warn(`useCreateThemeConfig: theme "${themeMode}" has neither translationKey nor nameTranslations`)
      }
    }
  }, [supportedThemes])

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
      return fallbackTheme
    } else {
      console.warn(`useCreateThemeConfig: fallbackTheme ${fallbackTheme} not found in the supported themes`)
    }
    return Object.keys(supportedThemes)[0]
  }, [fallbackTheme, preferredThemeMode, supportedThemes, systemTheme])

  const resolvedTheme: T = useMemo(() => supportedThemes[resolvedThemeMode].theme as T, [resolvedThemeMode, supportedThemes])

  useEffect(() => {
    if (theme === undefined) return
    if (theme === null) {
      deleteStoredTheme()
    } else if (supportedThemes[theme]) {
      setStoredTheme(theme)
    }
  }, [deleteStoredTheme, setStoredTheme, supportedThemes, theme])

  const onChangeRef = useStableEvent(onChangedTheme)

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
