import { View } from 'react-native'
import type { Preview } from '@storybook/react-native'

import { HightideProvider } from '@helpwave/hightide-native/global-contexts'
import { themes } from '@helpwave/hightide-native/theme'

const lightBackground = themes.light.colors.background
const darkBackground = themes.dark.colors.background

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: darkBackground },
        light: { name: 'Light', value: lightBackground },
      },
    },
  },
  globalTypes: {
    language: {
      name: 'Language',
      description: 'Component Language',
      defaultValue: 'system',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'system', title: 'System' },
          { value: 'en-US', title: 'English' },
          { value: 'de-DE', title: 'German' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const background = context.globals.backgrounds?.value
      const isDark = background === 'dark' || background === darkBackground
      const theme = isDark ? 'dark' : 'light'
      const locale = context.globals.language
      const surfaceBackground = isDark ? darkBackground : lightBackground

      return (
        <HightideProvider
          theme={{ theme }}
          locale={{ locale }}
        >
          <View style={{ flex: 1, padding: 16, backgroundColor: surfaceBackground }}>
            <Story />
          </View>
        </HightideProvider>
      )
    },
  ],
}

export default preview
