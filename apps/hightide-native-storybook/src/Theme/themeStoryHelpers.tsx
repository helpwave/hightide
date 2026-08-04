import {
  type ReactNode,
  useMemo
} from 'react'
import {
  Text,
  View
} from 'react-native'

import { Select } from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'

export const ThemeSelect = () => {
  const {
    theme,
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
      <Text style={{ color: theme.colors.onBackground }}>Theme</Text>
      <Select
        options={options}
        value={themeMode}
        showSearch={false}
        onValueChange={(value) => setTheme(value)}
      />
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
        backgroundColor: theme.colors.background,
        borderRadius: 12,
        padding: 16,
      }}
    >
      {children}
    </View>
  )
}
