import { View } from 'react-native'
import type { Preview } from '@storybook/react-native'

import { DebugProvider, HightideProvider } from '@helpwave/hightide-native/global-contexts'
import { themes } from '@helpwave/hightide-native/theme'

const lightBackground = themes.light.colors.background.color
const darkBackground = themes.dark.colors.background.color

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
    hitBox: {
      name: 'Hit Box',
      description: 'Visualize pressable hit boxes including hitSlop',
      defaultValue: 'hidden',
      toolbar: {
        icon: 'eye',
        items: [
          { value: 'hidden', title: 'Hit Box Hidden' },
          { value: 'visible', title: 'Hit Box Visible' },
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
      const isVisualizingHitBox = context.globals.hitBox === 'visible'

      return (
        <HightideProvider
          theme={{ theme }}
          locale={{ locale }}
        >
          <DebugProvider hitBox={{ isVisualizing: isVisualizingHitBox }}>
            <View style={{ flex: 1, padding: 16, backgroundColor: surfaceBackground, flexDirection: 'column', alignItems: 'flex-start' }}>
              <Story />
            </View>
          </DebugProvider>
        </HightideProvider>
      )
    },
  ],
}

export default preview
