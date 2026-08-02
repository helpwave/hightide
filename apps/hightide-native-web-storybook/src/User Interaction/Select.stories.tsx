import type {
  Meta,
  StoryObj
} from '@storybook/react'
import { action } from 'storybook/actions'

import { Select } from '@helpwave/hightide-native/components'
import { StorybookHelper } from '../helper'

const fruitOptions = StorybookHelper.selectValues
  .map((value) => ({
    id: value,
    label: value,
    disabled: value === 'Banana' || value === 'Kiwi',
  }))
  .sort((a, b) => a.id.localeCompare(b.id))

const meta = {
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const select: Story = {
  args: {
    options: fruitOptions,
    initialValue: null,
    disabled: false,
    invalid: false,
    showSearch: true,
    readOnly: false,
    placeholder: 'Select…',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
