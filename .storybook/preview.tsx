import type { Preview } from '@storybook/nextjs'
import '../src/style/globals.css'
import './storybookStyleOverrides.css'
import { HightideProvider } from '../src/global-contexts/HightideProvider'

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: '#000000' },
        light: { name: 'Light', value: '#FFFFFF' },
        system: { name: 'System', value: '#FFFFFF' },
      }
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
  },
  decorators: [
    (Story, context) => {
      const App = Story
      const theme = context.globals.backgrounds?.value ?? 'system'
      const locale = context.globals.language

      return (
        <main className="p-4">
          <HightideProvider
            theme={{ theme }}
            locale={{ locale }}
          >
            <App/>
          </HightideProvider>
        </main>
      )
    },
  ],
}

export default preview
