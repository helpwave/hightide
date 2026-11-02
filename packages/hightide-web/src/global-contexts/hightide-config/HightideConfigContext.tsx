import { createContext, type PropsWithChildren, useContext, useState } from 'react'
import type {
  HightideConfig as UtilsHightideConfig,
  LocalizationConfig,
  ThemeConfig
} from '@helpwave/hightide-utils/context'
import type { DeepPartial } from '@helpwave/hightide-utils/utils'

import type { SupportedLocalesConfig } from '../localization/forward-exports'
import { type SupportedThemesConfig } from '../theme/ThemeProvider'
import { HightideConfigUtils } from './HightideConfigUtils'

export type { LocalizationConfig, ThemeConfig }

export type TooltipConfig = {
  appearDelay: number,
  isAnimated: boolean,
  screenPadding: number,
}

export type HightideConfig = UtilsHightideConfig & {
  tooltip: TooltipConfig,
}

const defaultConfig: HightideConfig = {
  tooltip: {
    appearDelay: 0,
    isAnimated: false,
    screenPadding: 1,
  },
  theme: {
    initialTheme: 'light',
    supportedThemes: HightideConfigUtils.defaultSupportedThemes,
  },
  localization: {
    fallbackLocale: 'en-US',
    supportedLocales: HightideConfigUtils.defaultSupportedLocales,
  },
}

const mergeSupportedThemesConfig = (config: SupportedThemesConfig, overwrite: DeepPartial<SupportedThemesConfig> | undefined): SupportedThemesConfig => {
  if (overwrite === undefined) return config
  const result: SupportedThemesConfig = { ...config }
  for (const themeMode of Object.keys(overwrite)) {
    const info = overwrite[themeMode]
    result[themeMode] = {
      ...(result[themeMode] ?? {}),
      ...info,
      name: info?.name ?? result[themeMode]?.name ?? themeMode,
      isDark: info?.isDark ?? result[themeMode]?.isDark ?? false,
      translationKey: info?.translationKey ?? result[themeMode]?.translationKey,
      nameTranslations: {
        ...(result[themeMode]?.nameTranslations ?? {}),
        ...Object.fromEntries(
          Object.entries(info?.nameTranslations ?? {}).filter((entry): entry is [string, string] => entry[1] !== undefined)
        ),
      },
      theme: info?.theme ?? result[themeMode]?.theme,
    }
  }
  return result
}

const mergeSupportedLocalesConfig = (
  config: SupportedLocalesConfig,
  overwrite: DeepPartial<SupportedLocalesConfig> | undefined
): SupportedLocalesConfig => {
  if (overwrite === undefined) return config
  const result: SupportedLocalesConfig = { ...config }
  for (const locale of Object.keys(overwrite)) {
    const info = overwrite[locale]
    result[locale] = {
      ...(result[locale] ?? {}),
      ...info,
      localeName: info?.localeName ?? result[locale]?.localeName ?? locale,
    }
  }
  return result
}

function mergeConfig(config: HightideConfig, overwrite: DeepPartial<HightideConfig>): HightideConfig {
  return {
    theme: {
      ...config.theme,
      ...overwrite.theme,
      supportedThemes: mergeSupportedThemesConfig(config.theme.supportedThemes, overwrite.theme?.supportedThemes)
    },
    tooltip: {
      ...config.tooltip,
      ...overwrite.tooltip,
    },
    localization: {
      ...config.localization,
      ...overwrite.localization,
      supportedLocales: mergeSupportedLocalesConfig(
        config.localization.supportedLocales,
        overwrite.localization?.supportedLocales
      ),
    },
  }
}

type ConfigType = {
  config: HightideConfig,
  setConfig: (configOverwrite: DeepPartial<HightideConfig>) => void,
}

export const HightideConfigContext = createContext<ConfigType | null>(null)

export type HightideConfigProviderProps = PropsWithChildren & DeepPartial<HightideConfig>

export const HightideConfigProvider = ({
  children,
  ...initialOverwrite
}: HightideConfigProviderProps) => {
  const [config, setConfig] = useState<HightideConfig>(mergeConfig(defaultConfig, initialOverwrite))

  return (
    <HightideConfigContext.Provider
      value={{
        config,
        setConfig: (value) => setConfig((prevState) => mergeConfig(prevState, value)),
      }}
    >
      {children}
    </HightideConfigContext.Provider>
  )
}

export const useHightideConfig = () => {
  const context = useContext(HightideConfigContext)
  if (!context) {
    return {
      config: defaultConfig,
      setConfig: () => {
        console.error('useHightideConfig.setConfig is not available without a HightideConfigProvider. Try wrapping your app a HightideConfigProvider.')
      },
    }
  }
  return context
}
