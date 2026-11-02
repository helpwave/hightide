import type { Preview } from '@storybook/react-vite'
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
          { value: 'pt-BR', title: 'Portuguese (Brazil)' },
          { value: 'es-ES', title: 'Spanish' },
          { value: 'fr-FR', title: 'French' },
          { value: 'nl-NL', title: 'Dutch' },
          { value: 'it-IT', title: 'Italian' },
          { value: 'pl-PL', title: 'Polish' },
          { value: 'tr-TR', title: 'Turkish' },
          { value: 'ro-RO', title: 'Romanian' },
          { value: 'el-GR', title: 'Greek' },
          { value: 'ru-RU', title: 'Russian' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const App = Story
      const background = context.globals.backgrounds?.value
      const theme = background === 'dark' || background === '#000000'
        ? 'dark'
        : background === 'light'
          ? 'light'
          : null
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
