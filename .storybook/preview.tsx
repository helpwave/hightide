import type { Preview } from '@storybook/nextjs'
import type { ThemeType } from '../src'
import { LanguageProvider, ThemeProvider, useTheme } from '../src'
import '../src/css/globals.css'
import './storybookStyleOverrides.css'
import { useEffect } from 'react'

const colorToHex: Record<ThemeType, string> = {
  dark: '#222',
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
        <main className="bg-background text-background transition-colors duration-300 p-4 h-screen w-screen">
          <ThemeProvider>
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
