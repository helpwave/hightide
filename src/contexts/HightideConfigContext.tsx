import { createContext, type PropsWithChildren, useContext, useState } from 'react'
import type { ResolvedTheme } from '@/src/contexts/ThemeContext'
import type { HightideTranslationLocales } from '@/src/i18n/translations'
import type { DeepPartial } from '@/src/utils/typing'

export type TooltipConfig = {
  /**
   * Number of milliseconds until the tooltip appears
   */
  appearDelay: number,
  /**
   * Number of milliseconds until the tooltip disappears
   */
  disappearDelay: number,
}

export type ThemeConfig = {
  /**
   * The initial theme to show when:
   * 1. The system preference is not or cannot be loaded
   * 2. The user has not set an app preference
   */
  initialTheme: ResolvedTheme,
}

export type LocalizationConfig = {
  /**
   * The initial locale to use when:
   * 1. The system preference is not or cannot be loaded
   * 2. The user has not set an app preference
   */
  defaultLocale: HightideTranslationLocales,
}

export type HightideConfig = {
  tooltip: TooltipConfig,
  theme: ThemeConfig,
  locale: LocalizationConfig,
}

const defaultConfig: HightideConfig = {
  tooltip: {
    appearDelay: 200,
    disappearDelay: 400,
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