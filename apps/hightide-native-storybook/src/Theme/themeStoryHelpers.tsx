import {
  type ReactNode,
  useMemo
} from 'react'
import { View } from 'react-native'

import {
  Select,
  ThemedText
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'
import { useLocalization } from '@helpwave/hightide-utils/context/localization'
import type { HightideTranslationEntries } from '@helpwave/hightide-utils/i18n'
import { ThemeUtils } from '@helpwave/hightide-utils/context/theme'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

export const ThemeSelect = () => {
  const {
    themeMode,
    setTheme,
    supportedThemes,
  } = useTheme()
  const { locale } = useLocalization()
  const translation = useHightideTranslation()

  const options = useMemo(
    () => Object.entries(supportedThemes).map(([id, info]) => ({
      id,
      label: ThemeUtils.resolveThemeInformationLabel(
        info,
        locale,
        (key) => translation(key as keyof HightideTranslationEntries),
      ),
    })),
    [locale, supportedThemes, translation]
  )

  return (
    <View style={{ gap: 8, marginBottom: 16, maxWidth: 320 }}>
      <ThemedText>Theme</ThemedText>
      <Select
        value={themeMode}
        searchableThreshold={Number.POSITIVE_INFINITY}
        onValueChange={(value) => setTheme(value)}
      >
        {options.map((option) => (
          <Select.Option
            key={option.id}
            value={option.id}
            label={option.label}
          />
        ))}
      </Select>
    </View>
  )
}

export const ThemeStoryFrame = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme()

  return (
    <View
      style={{
        gap: 16,
        maxWidth: 420,
        backgroundColor: theme.colors.background.color,
        borderRadius: 12,
        padding: 16,
      }}
    >
      {children}
    </View>
  )
}
