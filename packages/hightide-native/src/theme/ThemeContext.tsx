import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useColorScheme as useSystemColorScheme } from 'react-native'
import type { ColorSchemeName, SemanticColors, Theme } from '@helpwave/hightide-tokens'
import { themes } from '@helpwave/hightide-tokens'

/** What the consumer can ask for: a fixed scheme or "follow the OS". */
export type ColorSchemePreference = ColorSchemeName | 'system'

type HightideThemeContextValue = {
  /** The fully-resolved theme for the active scheme. */
  theme: Theme,
  /** The active, resolved scheme (never `'system'`). */
  scheme: ColorSchemeName,
  /** The current preference, including `'system'`. */
  preference: ColorSchemePreference,
  /** Update the preference. Ignored when the provider is controlled. */
  setPreference: (preference: ColorSchemePreference) => void,
}

const HightideThemeContext = createContext<HightideThemeContextValue | null>(null)

export type HightideThemeProviderProps = PropsWithChildren<{
  /**
   * Force a specific scheme. When set, the provider is *controlled* and the OS
   * preference / `setPreference` are ignored.
   */
  colorScheme?: ColorSchemePreference,
  /** Initial preference for the uncontrolled case. @default 'system' */
  defaultColorScheme?: ColorSchemePreference,
}>

const resolveScheme = (
  preference: ColorSchemePreference,
  system: ColorSchemeName,
): ColorSchemeName => (preference === 'system' ? system : preference)

/**
 * Provides the hightide theme to every native component below it. Place it once
 * near the root of your app.
 *
 * ```tsx
 * <HightideThemeProvider>
 *   <App />
 * </HightideThemeProvider>
 * ```
 */
export const HightideThemeProvider = ({
  colorScheme,
  defaultColorScheme = 'system',
  children,
}: HightideThemeProviderProps) => {
  const system: ColorSchemeName = useSystemColorScheme() === 'dark' ? 'dark' : 'light'
  const [internalPreference, setInternalPreference] = useState<ColorSchemePreference>(defaultColorScheme)

  const isControlled = colorScheme !== undefined
  const preference = isControlled ? colorScheme : internalPreference

  const setPreference = useCallback((next: ColorSchemePreference) => {
    if (isControlled) {
      return
    }
    setInternalPreference(next)
  }, [isControlled])

  const scheme = resolveScheme(preference, system)

  const value = useMemo<HightideThemeContextValue>(() => ({
    theme: themes[scheme],
    scheme,
    preference,
    setPreference,
  }), [scheme, preference, setPreference])

  return (
    <HightideThemeContext.Provider value={value}>
      {children}
    </HightideThemeContext.Provider>
  )
}

/**
 * Reads the active hightide theme. Falls back to the light theme when no
 * provider is present so components still render in isolation (e.g. in tests).
 */
export const useHightideTheme = (): HightideThemeContextValue => {
  const context = useContext(HightideThemeContext)
  if (context) {
    return context
  }
  return {
    theme: themes.light,
    scheme: 'light',
    preference: 'light',
    setPreference: () => undefined,
  }
}

/** Convenience hook for just the semantic colors of the active theme. */
export const useColors = (): SemanticColors => useHightideTheme().theme.colors
