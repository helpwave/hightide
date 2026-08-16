import { HightideIconRegistry } from '@helpwave/hightide-native/icons'

export const colorPairKeys = [
  'primary',
  'secondary',
  'tertiary',
  'positive',
  'warning',
  'negative',
  'neutral',
] as const

export type ColorPairKey = typeof colorPairKeys[number]

const colorPairSelect = {
  control: 'select',
  options: colorPairKeys,
} as const

const iconSelect = {
  control: 'select',
  options: ['none', 'icon'],
  mapping: {
    none: undefined,
    icon: HightideIconRegistry.Plus,
  },
} as const

const exampleSelectValues = [
  'Strawberry',
  'Apple',
  'Banana',
  'Blueberry',
  'Mango',
  'Pineapple',
  'Grapes',
  'Orange',
  'Peach',
  'Watermelon',
  'Kiwi',
  'Cherry',
  'Lemon',
  'Papaya',
  'Raspberry',
  'Blackberry',
] as const

export type StorybookHelperSelectType = typeof exampleSelectValues[number]

export const StorybookHelper = {
  colorPairSelect,
  iconSelect,
  selectValues: exampleSelectValues,
}
