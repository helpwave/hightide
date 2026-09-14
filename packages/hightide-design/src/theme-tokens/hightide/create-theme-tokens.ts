import type { ThemeTokensConfig } from '../create/theme-tokens-config'
import type { HightideThemeTokens } from './theme-tokens'
import { createDarkThemeTokens } from './create-dark-theme-tokens'
import { createLightThemeTokens } from './create-light-theme-tokens'

export const createThemeTokens = (
  config: ThemeTokensConfig
): HightideThemeTokens => {
  const { themeMode, ...modeConfig } = config

  if (themeMode === 'dark') {
    return createDarkThemeTokens(modeConfig)
  }

  return createLightThemeTokens(modeConfig)
}
