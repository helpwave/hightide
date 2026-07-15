import type { KeyValueStore } from '../../hooks/useSingleValueStore'

export const resolvedThemes = ['light', 'dark'] as const
export type ResolvedTheme = typeof resolvedThemes[number]
export type ThemeType = ResolvedTheme | 'system'
export type ThemeWithSystem<TResolvedTheme extends string> = TResolvedTheme | 'system'

export const themeTypes: readonly ThemeType[] = ['light', 'dark', 'system']

export const ThemeUtil = {
  themes: themeTypes,
}

export type ThemeContextValue<TResolvedTheme extends string = string> = {
  theme: ThemeWithSystem<TResolvedTheme>,
  resolvedTheme: TResolvedTheme,
  setTheme: (theme: ThemeWithSystem<TResolvedTheme>) => void,
}

export type UseCreateThemeContextProps<TResolvedTheme extends string> = {
  store: KeyValueStore<unknown>,
  fallbackTheme: TResolvedTheme,
  theme?: ThemeWithSystem<TResolvedTheme>,
  systemTheme?: TResolvedTheme,
  onChangedTheme?: (theme: TResolvedTheme) => void,
}
