import type { Preview } from '@storybook/react'
import { LanguageProvider } from '../src/localization/LanguageProvider'
import { ModalRegister } from '../src/components/modals/ModalRegister'
import { modalRootName } from '../src/components/modals/Modal'
import '../src/css/globals.css'
import type { ThemeType } from '../src/theming/useTheme'
import { ThemeProvider } from '../src/theming/useTheme'

const colorToHex: Record<ThemeType, string> = {
  dark: '#1A1A1A',
  light: '#EEE',
}

const colorToHexReverse: Record<string, ThemeType> = {
  '#1A1A1A': 'dark',
  '#EEE': 'light',
  'transparent': 'light',
}

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: 'Dark', value: colorToHex.dark },
        { name: 'Light', value: colorToHex.light },
      ],
      default: 'Light',
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
      const theme = colorToHexReverse[context.globals.backgrounds?.value ?? colorToHex.light]
      const language = context.globals.language

      return (
        <main data-theme={theme}>
          <ThemeProvider initialTheme={theme}>
            <LanguageProvider initialLanguage={language}>
              <ModalRegister>
                <div id={modalRootName}>
                  <App />
                </div>
              </ModalRegister>
            </LanguageProvider>
          </ThemeProvider>
        </main>
      )
    },
  ],
}

export default preview
