import type { ThemeTokensConfig } from './theme-tokens-config'
import type { ThemeTokens } from './theme-tokens'
import { createDarkThemeTokens } from './create-dark-theme-tokens'
import { createLightThemeTokens } from './create-light-theme-tokens'

export const createThemeTokens = (
  config: ThemeTokensConfig
): ThemeTokens => {
  const { themeMode, ...modeConfig } = config

  if (themeMode === 'dark') {
    return createDarkThemeTokens(modeConfig)
  }

  return createLightThemeTokens(modeConfig)
}
