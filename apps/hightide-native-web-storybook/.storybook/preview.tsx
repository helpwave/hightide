import type { Preview } from '@storybook/react-native-web-vite'

import { HightideProvider } from '@helpwave/hightide-native/global-contexts'
import { themes } from '@helpwave/hightide-native/theme'

const lightBackground = themes.light.colors.background.color
const lightOnBackground = themes.light.colors.background.onColor
const darkBackground = themes.dark.colors.background.color
const darkOnBackground = themes.dark.colors.background.onColor

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: darkBackground },
        light: { name: 'Light', value: lightBackground },
      },
    },
    docs: {
      codePanel: true,
    },
    options: {
      selectedPanel: 'storybook/docs/panel',
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
      const App = Story
      const background = context.globals.backgrounds?.value
      const isDark = background === 'dark' || background === darkBackground
      const theme = isDark
        ? 'dark'
        : background === 'light' || background === lightBackground
          ? 'light'
          : 'light'
      const locale = context.globals.language
      const surfaceBackground = isDark ? darkBackground : lightBackground
      const surfaceColor = isDark ? darkOnBackground : lightOnBackground
      const isVisualizingHitBox = context.globals.hitBox === 'visible'

      return (
        <HightideProvider
          theme={{ theme }}
          locale={{ locale }}
          debug={{
            hitBox: {
              isVisualizing: isVisualizingHitBox,
            },
          }}
        >
          <style>{`
            html, body, main {
              transition: color 300ms, background-color 300ms;
              color: ${surfaceColor} !important;
              background-color: ${surfaceBackground} !important;
            }

            main {
              display: flex;
            }

            .sb-show-main {
              color: ${surfaceColor} !important;
              background-color: ${surfaceBackground} !important;
            }

            .sb-show-main.sb-main-padded {
              padding: 0;
            }
          `}</style>
          <main style={{ padding: '1rem' }}>
            <App />
          </main>
        </HightideProvider>
      )
    },
  ],
}

export default preview
