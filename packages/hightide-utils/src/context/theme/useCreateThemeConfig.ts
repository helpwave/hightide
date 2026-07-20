import { useCallback, useEffect, useMemo } from 'react'
import { useEventCallbackStabilizer } from '../../hooks/useEventCallbackStabelizer'
import type { SimpleValueStore } from '../../hooks/useSimpleStoreSyncedValue'
import { useSimpleStoreSyncedValue } from '../../hooks/useSimpleStoreSyncedValue'
import { StringUnionUtils } from '../../utils'

export type ThemeInformation = {
  theme: string,
  nameTranslations: Record<string, string>,
}

export type ThemeConfigValue = {
  preferredTheme: string | null,
  theme: string,
  setTheme: (theme: string | null) => void,
  supportedThemes: readonly ThemeInformation[],
}

export type SystemTheme = 'dark' | 'light'

export type UseCreateThemeConfigProps = {
  store: SimpleValueStore,
  fallbackTheme: string,
  supportedThemes: readonly ThemeInformation[],
  theme?: string | null,
  systemTheme?: SystemTheme,
  onChangedTheme?: (theme: string) => void,
}

export const useCreateThemeConfig = ({
  store,
  fallbackTheme,
  supportedThemes,
  theme,
  systemTheme,
  onChangedTheme,
}: UseCreateThemeConfigProps): ThemeConfigValue => {
  const supportedThemeKeys = useMemo(
    () => supportedThemes.map((value) => value.theme),
    [supportedThemes]
  )

  const {
    value: storedTheme,
    setValue: setStoredTheme,
    deleteValue: deleteStoredTheme,
  } = useSimpleStoreSyncedValue<string>({
    store,
    key: 'theme',
    decode: useCallback((value: string) => {
      if (StringUnionUtils.isUnionValue(value, supportedThemeKeys)) return value
      return null
    }, [supportedThemeKeys]),
    encode: useCallback((value) => value, []),
  })

  const preferredTheme = useMemo((): string | null => {
    if (theme !== undefined) {
      return theme
    }
    return storedTheme
  }, [storedTheme, theme])

  const resolvedTheme = useMemo(() => {
    if (preferredTheme !== null && StringUnionUtils.isUnionValue(preferredTheme, supportedThemeKeys)) {
      return preferredTheme
    }
    if (systemTheme && StringUnionUtils.isUnionValue(systemTheme, supportedThemeKeys)) {
      return systemTheme
    }
    return fallbackTheme
  }, [fallbackTheme, preferredTheme, supportedThemeKeys, systemTheme])

  useEffect(() => {
    if (theme === undefined) return
    if (theme === null) {
      deleteStoredTheme()
    } else if (StringUnionUtils.isUnionValue(theme, supportedThemeKeys)) {
      setStoredTheme(theme)
    }
  }, [deleteStoredTheme, setStoredTheme, supportedThemeKeys, theme])

  const onChangeRef = useEventCallbackStabilizer(onChangedTheme)

  useEffect(() => {
    onChangeRef?.(resolvedTheme)
  }, [onChangeRef, resolvedTheme])

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
    if (!StringUnionUtils.isUnionValue(newTheme, supportedThemeKeys)) return
    setStoredTheme(newTheme)
  }, [deleteStoredTheme, setStoredTheme, supportedThemeKeys, theme])

  return {
    preferredTheme,
    theme: resolvedTheme,
    setTheme,
    supportedThemes,
  }
}
