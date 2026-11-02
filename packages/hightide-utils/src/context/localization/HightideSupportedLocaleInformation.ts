import type { LocaleInformation } from './LocalizationContext'

export const HightideSupportedLocaleInformation: Record<string, LocaleInformation> = {
  'de-DE': {
    localeName: 'Deutsch',
    defaultIs24HourFormat: true,
    defaultStartingWeekday: 'monday',
    defaultCalendarType: 'Gregorian',
  },
  'en-US': {
    localeName: 'English (US)',
    defaultIs24HourFormat: false,
    defaultStartingWeekday: 'sunday',
    defaultCalendarType: 'Gregorian',
  },
  'pt-BR': {
    localeName: 'Português (Brasil)',
    defaultIs24HourFormat: true,
    defaultStartingWeekday: 'sunday',
    defaultCalendarType: 'Gregorian',
  },
  'es-ES': {
    localeName: 'Español',
    defaultIs24HourFormat: true,
    defaultStartingWeekday: 'monday',
    defaultCalendarType: 'Gregorian',
  },
  'fr-FR': {
    localeName: 'Français',
    defaultIs24HourFormat: true,
    defaultStartingWeekday: 'monday',
    defaultCalendarType: 'Gregorian',
  },
  'nl-NL': {
    localeName: 'Nederlands',
    defaultIs24HourFormat: true,
    defaultStartingWeekday: 'monday',
    defaultCalendarType: 'Gregorian',
  },
  'it-IT': {
    localeName: 'Italiano',
    defaultIs24HourFormat: true,
    defaultStartingWeekday: 'monday',
    defaultCalendarType: 'Gregorian',
  },
  'pl-PL': {
    localeName: 'Polski',
    defaultIs24HourFormat: true,
    defaultStartingWeekday: 'monday',
    defaultCalendarType: 'Gregorian',
  },
  'tr-TR': {
    localeName: 'Türkçe',
    defaultIs24HourFormat: true,
    defaultStartingWeekday: 'monday',
    defaultCalendarType: 'Gregorian',
  },
  'ro-RO': {
    localeName: 'Română',
    defaultIs24HourFormat: true,
    defaultStartingWeekday: 'monday',
    defaultCalendarType: 'Gregorian',
  },
  'el-GR': {
    localeName: 'Ελληνικά',
    defaultIs24HourFormat: false,
    defaultStartingWeekday: 'monday',
    defaultCalendarType: 'Gregorian',
  },
  'ru-RU': {
    localeName: 'Русский',
    defaultIs24HourFormat: true,
    defaultStartingWeekday: 'monday',
    defaultCalendarType: 'Gregorian',
  },
}
