import type { Preview } from '@storybook/nextjs'
import '../src/style/globals.css'
import './storybookStyleOverrides.css'
import { ThemeProvider } from '../src/theming/useTheme'
import { LanguageProvider } from '../src/localization/LanguageProvider'

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: '#000000' },
        light: { name: 'Light', value: '#FFFFFF' },
        system: { name: 'System', value: '#FFFFFF' },
      }
    },
  },
  globalTypes: {
    language: {
      name: 'Language',
      description: 'Component Language',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'system', title: 'System' },
          { value: 'en', title: 'English' },
          { value: 'de', title: 'German' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const App = Story
      const theme = context.globals.backgrounds?.value ?? 'system'
      const language = context.globals.language

      return (
        <main className="p-4">
          <ThemeProvider theme={theme}>
            <LanguageProvider language={language}>
              <App/>
            </LanguageProvider>
          </ThemeProvider>
        </main>
      )
    },
  ],
}

export default preview
