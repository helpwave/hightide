import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'

import { MultiSelect, MultiSelectOption } from '@helpwave/hightide-native/components'
import { StorybookHelper } from '../helper'

const fruitOptions = StorybookHelper.selectValues
  .map((value) => ({
    id: value,
    label: value,
    disabled: value === 'Banana' || value === 'Kiwi',
  }))
  .sort((a, b) => a.id.localeCompare(b.id))

const meta = {
  component: MultiSelect,
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const multiSelect: Story = {
  args: {
    initialValue: [],
    disabled: false,
    invalid: false,
    searchableThreshold: 6,
    readOnly: false,
    placeholder: 'Select…',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
  render: (args) => (
    <MultiSelect {...args}>
      {fruitOptions.map((option) => (
        <MultiSelectOption
          key={option.id}
          id={option.id}
          value={option.id}
          label={option.label}
          disabled={option.disabled}
        />
      ))}
    </MultiSelect>
  ),
}
