/**
 * The raw, theme-independent color palette for the helpwave design language.
 *
 * These values are the single source of truth for the basic colors and are
 * transcribed 1:1 from the web library's `src/style/theme/colors/basic.css`.
 * Both the web (Tailwind) and native (NativeWind / StyleSheet) styling layers
 * derive their colors from here so the two platforms can never drift apart.
 *
 * Prefer the *semantic* colors (see `./semantic`) in component code – the raw
 * palette should mostly be referenced when defining semantics.
 */
export const palette = {
  white: '#FFFFFF',
  black: '#000000',

  gray: {
    25: '#F8F8F8',
    50: '#F2F2F2',
    75: '#EEEEEE',
    100: '#E6E6E6',
    150: '#D8D8D8',
    200: '#CCCCCC',
    300: '#B3B3B3',
    400: '#999999',
    500: '#888888',
    550: '#777777',
    600: '#666666',
    650: '#555555',
    700: '#4D4D4D',
    750: '#3F3F3F',
    800: '#333333',
    850: '#222222',
    900: '#1A1A1A',
    950: '#0D0D0D',
  },

  green: {
    100: '#D1EFD8',
    500: '#69CB81',
    600: '#61BF78',
    700: '#53A567',
    900: '#2C5536',
  },

  orange: {
    100: '#FBECD9',
    200: '#F7D8B3',
    500: '#EA9E40',
    600: '#C18133',
    900: '#4A2F1A',
  },

  purple: {
    50: '#EFE6FD',
    100: '#CEB0FA',
    200: '#B892F3',
    300: '#9B7CDD',
    400: '#8470C5',
    500: '#694BB4',
    600: '#56389B',
    700: '#462C83',
    800: '#362165',
    900: '#27144A',
    950: '#1B0D33',
  },

  blue: {
    50: '#F6FAFF',
    100: '#D6E3F9',
    200: '#99B9EF',
    500: '#3272DF',
    600: '#285BB2',
    800: '#1A4080',
    900: '#11243E',
  },

  red: {
    50: '#FFF9F9',
    100: '#FBE0E2',
    200: '#F7C2C5',
    300: '#F4A3A7',
    400: '#E3798A',
    500: '#DC576D',
    600: '#D53550',
    700: '#BB273F',
    900: '#5C252E',
  },
} as const

export type Palette = typeof palette
