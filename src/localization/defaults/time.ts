import type { TranslationPlural, Translation } from '../useTranslation'

export type MonthTranslationType = {
  january: string,
  february: string,
  march: string,
  april: string,
  may: string,
  june: string,
  july: string,
  august: string,
  september: string,
  october: string,
  november: string,
  december: string,
}

export const monthTranslation: Translation<MonthTranslationType> = {
  en: {
    january: 'January',
    february: 'Febuary',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  },
  de: {
    january: 'Januar',
    february: 'Febuar',
    march: 'März',
    april: 'April',
    may: 'Mai',
    june: 'Juni',
    july: 'Juli',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  }
}

export type TimeTranslationType = {
  century: TranslationPlural,
  decade: TranslationPlural,
  year: TranslationPlural,
  month: TranslationPlural,
  day: TranslationPlural,
  hour: TranslationPlural,
  minute: TranslationPlural,
  second: TranslationPlural,
  millisecond: TranslationPlural,
  microsecond: TranslationPlural,
  nanosecond: TranslationPlural,
  yesterday: string,
  today: string,
  tomorrow: string,
  in: string,
  ago: string,
} & MonthTranslationType

export const timeTranslation: Translation<TimeTranslationType> = {
  en: {
    ...monthTranslation.en,
    century: { one: 'Century', other: 'Centuries' },
    decade: { one: 'Decade', other: 'Decades' },
    year: { one: 'Year', other: 'Years' },
    month: { one: 'Month', other: 'Months' },
    day: { one: 'Day', other: 'Days' },
    hour: { one: 'Hour', other: 'Hours' },
    minute: { one: 'Minute', other: 'Minutes' },
    second: { one: 'Second', other: 'Seconds' },
    millisecond: { one: 'Millisecond', other: 'Milliseconds' },
    microsecond: { one: 'Microsecond', other: 'Microseconds' },
    nanosecond: { one: 'Nanosecond', other: 'Nanoseconds' },
    yesterday: 'Yesterday',
    today: 'Today',
    tomorrow: 'Tomorrow',
    in: 'in',
    ago: 'ago',
  },
  de: {
    ...monthTranslation.de,
    century: { one: 'Jahrhundert', other: 'Jahrhunderte' },
    decade: { one: 'Jahrzehnt', other: 'Jahrzehnte' },
    year: { one: 'Jahr', other: 'Jahre' },
    month: { one: 'Monat', other: 'Monate' },
    day: { one: 'Tag', other: 'Tage' },
    hour: { one: 'Stunde', other: 'Stunden' },
    minute: { one: 'Minute', other: 'Minuten' },
    second: { one: 'Sekunde', other: 'Sekunden' },
    millisecond: { one: 'Millisekunde', other: 'Millisekunden' },
    microsecond: { one: 'Mikrosekunde', other: 'Mikrosekunden' },
    nanosecond: { one: 'Nanosekunde', other: 'Nanosekunden' },
    yesterday: 'Gestern',
    today: 'Heute',
    tomorrow: 'Morgen',
    in: 'in',
    ago: 'vor',
  }
}