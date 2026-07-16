import { Plus } from 'lucide-react-native'

const iconSelect = {
  control: 'select',
  options: ['none', 'icon'],
  mapping: {
    none: undefined,
    icon: Plus,
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
  iconSelect,
  selectValues: exampleSelectValues,
}
