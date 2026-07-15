import { useCallback, useEffect, useMemo } from 'react'
import { useEventCallbackStabilizer } from '../../hooks/useEventCallbackStabelizer'
import type { SimpleValueStore } from '../../hooks/useSimpleStoreSyncedValue'
import { useSimpleStoreSyncedValue } from '../../hooks/useSimpleStoreSyncedValue'
import { StringUnionUtils } from '@/src/utils'
import type { ThemeContextValue, ThemeInformation } from './ThemeContext'

export type SystemTheme = 'dark' | 'light'

export type UseCreateThemeContextProps = {
  store: SimpleValueStore,
  fallbackTheme: string,
  supportedThemes: readonly ThemeInformation[],
  theme?: string,
  systemTheme?: SystemTheme,
  onChangedTheme?: (theme: string) => void,
}

export const useCreateThemeContext = ({
  store,
  fallbackTheme,
  supportedThemes,
  theme,
  systemTheme,
  onChangedTheme,
}: UseCreateThemeContextProps): ThemeContextValue => {
  const supportedThemeKeys = useMemo(
    () => supportedThemes.map((value) => value.theme),
    [supportedThemes]
  )
  const resolvedThemeKeys = useMemo(
    () => supportedThemeKeys.filter((key) => key !== 'system'),
    [supportedThemeKeys]
  )

  const {
    value: storedTheme,
    setValue: setStoredTheme,
    deleteValue: deleteStoredTheme,
  } = useSimpleStoreSyncedValue<string>({
    store,
    key: 'theme',
    decode: useCallback((value: string) => {
      if (resolvedThemeKeys.includes(value)) return value
      return null
    }, [resolvedThemeKeys]),
    encode: useCallback((value) => value, []),
  })

  const resolvedTheme = useMemo(() => {
    if (theme && theme !== 'system') {
      return theme
    }
    if (storedTheme) {
      return storedTheme
    }
    if (systemTheme && resolvedThemeKeys.includes(systemTheme)) {
      return systemTheme
    }
    return fallbackTheme
  }, [fallbackTheme, resolvedThemeKeys, storedTheme, systemTheme, theme])

  useEffect(() => {
    if (theme === undefined) return
    if (theme === 'system') {
      deleteStoredTheme()
    } else if (StringUnionUtils.isUnionValue(theme, supportedThemeKeys)) {
      setStoredTheme(theme)
    }
  }, [deleteStoredTheme, setStoredTheme, supportedThemeKeys, theme])

  const onChangeRef = useEventCallbackStabilizer(onChangedTheme)

  useEffect(() => {
    onChangeRef?.(resolvedTheme)
  }, [onChangeRef, resolvedTheme])

  const setTheme = useCallback((newTheme: string) => {
    if (theme !== undefined) {
      console.warn(
        'useCreateThemeContext: Attempting to change the theme while setting a fixed theme won\'t have any effect. '
          + 'Change the theme provided to the ThemeProvider instead.'
      )
      return
    }
    if (newTheme === 'system') {
      deleteStoredTheme()
      return
    }
    if (!StringUnionUtils.isUnionValue(newTheme, supportedThemeKeys)) return
    setStoredTheme(newTheme)
  }, [deleteStoredTheme, setStoredTheme, supportedThemeKeys, theme])

  return {
    theme: resolvedTheme,
    setTheme,
    supportedThemes,
  }
}
