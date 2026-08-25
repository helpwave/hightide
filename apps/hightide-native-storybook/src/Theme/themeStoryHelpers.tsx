import {
  type ReactNode,
  useMemo
} from 'react'
import { View } from 'react-native'

import {
  Select,
  SelectOption,
  ThemedText
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'

export const ThemeSelect = () => {
  const {
    themeMode,
    setTheme,
    supportedThemes,
  } = useTheme()

  const options = useMemo(
    () => Object.entries(supportedThemes).map(([id, info]) => ({
      id,
      label: info.nameTranslations['en-US'] ?? id,
    })),
    [supportedThemes]
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
          <SelectOption
            key={option.id}
            id={option.id}
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
