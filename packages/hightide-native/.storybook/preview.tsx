import type { Preview } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import type { ColorSchemePreference } from '../src/theme/ThemeContext'
import { HightideThemeProvider } from '../src/theme/ThemeContext'
import { themes } from '@helpwave/hightide-tokens'

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  globalTypes: {
    colorScheme: {
      name: 'Theme',
      description: 'hightide color scheme',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const preference = (context.globals.colorScheme ?? 'light') as ColorSchemePreference
      const scheme = preference === 'dark' ? 'dark' : 'light'
      return (
        <HightideThemeProvider colorScheme={preference}>
          <View style={{ padding: 24, backgroundColor: themes[scheme].colors.background, alignItems: 'flex-start', gap: 16 }}>
            <Story />
          </View>
        </HightideThemeProvider>
      )
    },
  ],
}

export default preview
