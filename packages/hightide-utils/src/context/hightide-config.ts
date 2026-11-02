import type { LocalizationConfig } from './localization/LocalizationContext'
import type { ThemeConfig } from './theme/useCreateThemeConfig'

export type HightideConfig<T = unknown> = {
  theme: ThemeConfig<T>,
  localization: LocalizationConfig,
}
