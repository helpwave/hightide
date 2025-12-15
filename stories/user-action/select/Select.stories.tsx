import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { SelectOption, SelectUncontrolled } from '../../../src/components/user-action/Select'

const meta = {
  title: 'User Action/Select',
  component: SelectUncontrolled,
} satisfies Meta<typeof SelectUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const select: Story = {
  args: {
    disabled: false,
    onValueChanged: action('updated'),
    children: [
      { value: 'Apple' },
      { value: 'Pear', disabled: true },
      { value: 'Strawberry' },
      { value: 'Pineapple' },
      { value: 'Blackberry' },
      { value: 'Blueberry', disabled: true },
      { value: 'Banana' },
      { value: 'Kiwi', disabled: true },
      { value: 'Maracuja', disabled: true },
      { value: 'Wildberry', disabled: true },
      { value: 'Watermelon' },
      { value: 'Honeymelon' },
      { value: 'Papja' }
    ].sort((a,b) => a.value.localeCompare(b.value))
      .map((value, index) => (<SelectOption key={index} {...value} />)),
  },
}
