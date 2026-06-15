import { createContext, type PropsWithChildren, useContext, useState } from 'react'
import type { ResolvedTheme } from '@/src/global-contexts/ThemeContext'
import type { HightideTranslationLocales } from '@/src/i18n/translations'
import type { DeepPartial } from '@/src/utils/typing'

export type TooltipConfig = {
  appearDelay: number,
  isAnimated: boolean,
}

export type ThemeConfig = {
  initialTheme: ResolvedTheme,
}

export type LocalizationConfig = {
  defaultLocale: HightideTranslationLocales,
  defaultTimeZone?: string,
  defaultIs24HourFormat?: boolean,
}

export type HightideConfig = {
  tooltip: TooltipConfig,
  theme: ThemeConfig,
  locale: LocalizationConfig,
}

const defaultConfig: HightideConfig = {
  tooltip: {
    appearDelay: 0,
    isAnimated: false,
  },
  theme: {
    initialTheme: 'light'
  },
  locale: {
    defaultLocale: 'de-DE',
  }
}

function mergeConfig(config: HightideConfig, overwrite: DeepPartial<HightideConfig>): HightideConfig {
  return {
    locale: {
      ...config.locale,
      ...overwrite?.locale
    },
    theme: {
      ...config.theme,
      ...overwrite.theme,
    },
    tooltip: {
      ...config.tooltip,
      ...overwrite.tooltip,
    }
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
        setConfig: (value) => setConfig(prevState => mergeConfig(prevState, value)),
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
      }
    }
  }
  return context
}