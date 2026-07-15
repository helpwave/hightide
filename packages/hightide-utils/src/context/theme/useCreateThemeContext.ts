import { useCallback, useEffect, useMemo } from 'react'
import { useEventCallbackStabilizer } from '../../hooks/useEventCallbackStabelizer'
import type { KeyValueStore } from '../../hooks/useSimpleStoreSyncedValue'
import { useSimpleStoreSyncedValue } from '../../hooks/useSimpleStoreSyncedValue'
import type {
  ThemeContextValue,
  ThemeWithSystem,
  UseCreateThemeContextProps,
} from './types'

export const useCreateThemeContext = <TResolvedTheme extends string>({
  store,
  fallbackTheme,
  theme,
  systemTheme,
  onChangedTheme,
}: UseCreateThemeContextProps<TResolvedTheme>): ThemeContextValue<TResolvedTheme> => {
  const {
    value: storedTheme,
    setValue: setStoredTheme,
    deleteValue: deleteStoredTheme,
  } = useSimpleStoreSyncedValue<TResolvedTheme | null>({
    store: store as KeyValueStore<unknown> as KeyValueStore<TResolvedTheme | null>,
    key: 'theme',
    defaultValue: null,
  })

  const resolvedTheme = useMemo(() => {
    if (theme && theme !== 'system') {
      return theme
    }
    if (storedTheme) {
      return storedTheme
    }
    if (systemTheme) {
      return systemTheme
    }
    return fallbackTheme
  }, [fallbackTheme, theme, storedTheme, systemTheme])

  const themePreference = useMemo((): ThemeWithSystem<TResolvedTheme> => {
    if (theme !== undefined) {
      return theme
    }
    if (storedTheme) {
      return storedTheme
    }
    return 'system'
  }, [theme, storedTheme])

  useEffect(() => {
    if (theme === undefined) return
    if (theme === 'system') {
      deleteStoredTheme()
    } else {
      setStoredTheme(theme)
    }
  }, [theme, deleteStoredTheme, setStoredTheme])

  const onChangeRef = useEventCallbackStabilizer(onChangedTheme)

  useEffect(() => {
    onChangeRef?.(resolvedTheme)
  }, [resolvedTheme, onChangeRef])

  const setTheme = useCallback((newTheme: ThemeWithSystem<TResolvedTheme>) => {
    if (theme !== undefined) {
      console.warn(
        'useCreateThemeContext: Attempting to change the theme while setting a fixed theme won\'t have any effect. '
          + 'Change the theme provided to the ThemeProvider instead.',
      )
      return
    }
    if (newTheme === 'system') {
      deleteStoredTheme()
    } else {
      setStoredTheme(newTheme)
    }
  }, [deleteStoredTheme, setStoredTheme, theme])

  return {
    theme: themePreference,
    resolvedTheme,
    setTheme,
  }
}
