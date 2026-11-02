import type { SupportedLocalesConfig } from '../localization/forward-exports'
import type { SupportedThemesConfig } from '../theme/ThemeProvider'

export const HightideConfigUtils = {
  defaultSupportedLocales: {
    'de-DE': {
      localName: 'Deutsch',
      defaultIs24HourFormat: true,
      defaultStartingWeekday: 'monday',
      defaultCalendarType: 'Gregorian',
    },
    'en-US': {
      localName: 'English (US)',
      defaultIs24HourFormat: false,
      defaultStartingWeekday: 'sunday',
      defaultCalendarType: 'Gregorian',
    },
    'pt-BR': {
      localName: 'Português (Brasil)',
      defaultIs24HourFormat: true,
      defaultStartingWeekday: 'sunday',
      defaultCalendarType: 'Gregorian',
    },
    'es-ES': {
      localName: 'Español',
      defaultIs24HourFormat: true,
      defaultStartingWeekday: 'monday',
      defaultCalendarType: 'Gregorian',
    },
    'fr-FR': {
      localName: 'Français',
      defaultIs24HourFormat: true,
      defaultStartingWeekday: 'monday',
      defaultCalendarType: 'Gregorian',
    },
    'nl-NL': {
      localName: 'Nederlands',
      defaultIs24HourFormat: true,
      defaultStartingWeekday: 'monday',
      defaultCalendarType: 'Gregorian',
    },
    'it-IT': {
      localName: 'Italiano',
      defaultIs24HourFormat: true,
      defaultStartingWeekday: 'monday',
      defaultCalendarType: 'Gregorian',
    },
    'pl-PL': {
      localName: 'Polski',
      defaultIs24HourFormat: true,
      defaultStartingWeekday: 'monday',
      defaultCalendarType: 'Gregorian',
    },
    'tr-TR': {
      localName: 'Türkçe',
      defaultIs24HourFormat: true,
      defaultStartingWeekday: 'monday',
      defaultCalendarType: 'Gregorian',
    },
    'ro-RO': {
      localName: 'Română',
      defaultIs24HourFormat: true,
      defaultStartingWeekday: 'monday',
      defaultCalendarType: 'Gregorian',
    },
    'el-GR': {
      localName: 'Ελληνικά',
      defaultIs24HourFormat: false,
      defaultStartingWeekday: 'monday',
      defaultCalendarType: 'Gregorian',
    },
    'ru-RU': {
      localName: 'Русский',
      defaultIs24HourFormat: true,
      defaultStartingWeekday: 'monday',
      defaultCalendarType: 'Gregorian',
    },
  } as const satisfies SupportedLocalesConfig,
  defaultSupportedThemes: {
    light: {
      nameTranslations: {
        'de-DE': 'Hell',
        'en-US': 'Light',
        'pt-BR': 'Claro',
        'es-ES': 'Claro',
        'fr-FR': 'Clair',
        'nl-NL': 'Licht',
        'it-IT': 'Chiaro',
        'pl-PL': 'Jasny',
        'tr-TR': 'Açık',
        'ro-RO': 'Luminos',
        'el-GR': 'Φωτεινό',
        'ru-RU': 'Светлая',
      },
    },
    dark: {
      nameTranslations: {
        'de-DE': 'Dunkel',
        'en-US': 'Dark',
        'pt-BR': 'Escuro',
        'es-ES': 'Oscuro',
        'fr-FR': 'Sombre',
        'nl-NL': 'Donker',
        'it-IT': 'Scuro',
        'pl-PL': 'Ciemny',
        'tr-TR': 'Koyu',
        'ro-RO': 'Întunecat',
        'el-GR': 'Σκοτεινό',
        'ru-RU': 'Тёмная',
      },
    },
  } as const satisfies SupportedThemesConfig,
}
