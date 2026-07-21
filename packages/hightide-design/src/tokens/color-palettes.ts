import type { ColorPaletteBasicToken, ColorPaletteDetailedToken, ColorPaletteSingleValueToken, ColorPaletteTokens } from '../types'

export const colorPalettes = {
  white: {
    type: 'singleValue',
    value: '#ffffff',
  } as const satisfies ColorPaletteSingleValueToken,
  black: {
    type: 'singleValue',
    value:'#000000',
  } as const satisfies ColorPaletteSingleValueToken,
  gray: {
    type: 'detailed',
    value: {
      25: '#f8f8f8',
      50: '#f2f2f2',
      75: '#eeeeee',
      100: '#e6e6e6',
      150: '#d8d8d8',
      200: '#cccccc',
      250: '#c0c0c0',
      300: '#b3b3b3',
      350: '#a6a6a6',
      400: '#999999',
      450: '#909090',
      500: '#888888',
      550: '#777777',
      600: '#666666',
      650: '#555555',
      700: '#4d4d4d',
      750: '#3f3f3f',
      800: '#333333',
      850: '#222222',
      900: '#1a1a1a',
      925: '#141414',
      950: '#0d0d0d',
      975: '#070707',
    }
  }  as const satisfies ColorPaletteDetailedToken,
  green: {
    type: 'basic',
    value: {
      50: '#e8f7ec',
      100: '#d1efd8',
      200: '#b7e6c2',
      300: '#9dd5ad',
      400: '#83d497',
      500: '#69cb81',
      600: '#61bf78',
      700: '#53a567',
      800: '#407d4f',
      900: '#2c5536',
      950: '#162b1b',
    }
  } as const satisfies ColorPaletteBasicToken,
  orange: {
    type: 'basic',
    value: {
      50: '#fdf5ec',
      100: '#fbecd9',
      200: '#f7d8b3',
      300: '#f4c992',
      400: '#efb66c',
      500: '#ea9e40',
      600: '#c18133',
      700: '#966327',
      800: '#704924',
      900: '#4a2f1a',
      950: '#25180d',
    }
  } as const satisfies ColorPaletteBasicToken,
  purple: {
    type: 'basic',
    value: {
      50: '#efe6fd',
      100: '#ceb0fa',
      200: '#b892f3',
      300: '#9b7cdd',
      400: '#8470c5',
      500: '#694bb4',
      600: '#56389b',
      700: '#462c83',
      800: '#362165',
      900: '#27144a',
      950: '#1b0d33',
    }
  } as const satisfies ColorPaletteBasicToken,
  blue: {
    type: 'basic',
    value: {
      50: '#f6faff',
      100: '#d6e3f9',
      200: '#99b9ef',
      300: '#6a9ae7',
      400: '#4b86e3',
      500: '#3272df',
      600: '#285bb2',
      700: '#204a91',
      800: '#1a4080',
      900: '#11243e',
      950: '#09121f',
    }
  } as const satisfies ColorPaletteBasicToken,
  red: {
    type: 'basic',
    value: {
      50: '#fff9f9',
      100: '#fbe0e2',
      200: '#f7c2c5',
      300: '#f4a3a7',
      400: '#e3798a',
      500: '#dc576d',
      600: '#d53550',
      700: '#bb273f',
      800: '#8b2634',
      900: '#5c252e',
      950: '#2e1317',
    }
  } as const satisfies ColorPaletteBasicToken,
} as const satisfies ColorPaletteTokens
