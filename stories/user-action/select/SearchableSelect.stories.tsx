import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { SelectUncontrolled } from '../../../src'

const meta = {
  title: 'User Action/Select',
  component: SelectUncontrolled<string>,
} satisfies Meta<typeof SelectUncontrolled<string>>

export default meta
type Story = StoryObj<typeof meta>;

export const searchableSelect: Story = {
  args: {
    label: { name: 'Your favourite fruit' },
    options: [
      { value: 'Apple', label: 'Apple', searchTags: ['Apple'] },
      { value: 'Pear', label: 'Pear', searchTags: ['Pear'], disabled: true },
      { value: 'Strawberry', label: 'Strawberry', searchTags: ['Strawberry'] },
      { value: 'Pineapple', label: 'Pineapple-styled', searchTags: ['Pineapple-styled'] },
      { value: 'Blackberry', label: 'Blackberry', searchTags: ['Blackberry'] },
      { value: 'Blueberry', label: 'Blueberry', searchTags: ['Blueberry'], disabled: true },
      { value: 'Tomato', label: 'Tomato', searchTags: ['Tomato'], disabled: true }
    ],
    onChange: action('updated'),
    isSearchEnabled: true,
    isDisabled: false,
    hintText: 'Hinttext',
    className: '',
  },
}
