import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'

import { Select, SelectOption } from '@helpwave/hightide-native/components'
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
    initialValue: null,
    disabled: false,
    invalid: false,
    searchableThreshold: 6,
    readOnly: false,
    placeholder: 'Select…',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
  render: (args) => (
    <Select {...args}>
      {fruitOptions.map((option) => (
        <SelectOption
          key={option.id}
          value={option.id}
          label={option.label}
          disabled={option.disabled}
        />
      ))}
    </Select>
  ),
}
