import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { action } from 'storybook/actions'
import { MultiSelect } from '@/src/components/MultiSelect/MultiSelect'
import { StorybookHelper } from '@/src/storybook/helper'

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
    options: fruitOptions,
    initialValue: [],
    disabled: false,
    invalid: false,
    showSearch: true,
    readOnly: false,
    placeholder: 'Select…',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
