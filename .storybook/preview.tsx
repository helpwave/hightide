import type { Preview } from '@storybook/nextjs'
import { LanguageProvider, ThemeProvider, useTheme } from '../src'
import '../src/style/globals.css'
import './storybookStyleOverrides.css'
import { useEffect } from 'react'

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
          { value: 'en', title: 'English' },
          { value: 'de', title: 'German' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const App = Story
      const theme = context.globals.backgrounds?.value
      const { setTheme } = useTheme()

      useEffect(() => {
        if(!theme) {
          return
        }
        setTheme(theme)
      }, [theme]) // eslint-disable-line react-hooks/exhaustive-deps

      const language = context.globals.language

      return (
        <main className="p-4">
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
