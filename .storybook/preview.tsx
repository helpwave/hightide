import type { Preview } from '@storybook/nextjs'
import type { ThemeType } from '../src'
import { LanguageProvider, ThemeProvider } from '../src'
import '../src/css/globals.css'
import './storybookStyleOverrides.css'

const colorToHex: Record<ThemeType, string> = {
  dark: '#1A1A1A',
  light: '#EEE',
}

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: colorToHex.dark },
        light: { name: 'Light', value: colorToHex.light },
      }
    },
  },
  initialGlobals: {
    backgrounds: { value: 'light' },
  },
  globalTypes: {
    language: {
      name: 'Language',
      description: 'Component Language',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'de', title: 'German' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const App = Story
      const theme = context.globals.backgrounds?.value ?? 'light'
      const language = context.globals.language

      return (
        <main data-theme={theme}>
          <ThemeProvider initialTheme={theme}>
            <LanguageProvider initialLanguage={language}>
              <App/>
            </LanguageProvider>
          </ThemeProvider>
        </main>
      )
    },
  ],
}

export default preview
