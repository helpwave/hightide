import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { SelectUncontrolled } from '../../../src'

const meta = {
  title: 'User Action/Select',
  component: SelectUncontrolled<string>,
} satisfies Meta<typeof SelectUncontrolled<string>>

export default meta
type Story = StoryObj<typeof meta>;

export const select: Story = {
  args: {
    label: { name: 'Your favourite fruit' },
    options: [
      { value: '1', label: 'Apple' },
      { value: '2', label: 'Pear', disabled: true },
      { value: '3', label: 'Strawberry' },
      { value: '4', label: 'Pineapple-styled' },
      { value: '5', label: 'Blackberry' },
      { value: '6', label: 'Blueberry', disabled: true }
    ],
    onChange: action('updated'),
    isDisabled: false,
    hintText: 'Select something',
    className: 'max-w-96',
  },
}
