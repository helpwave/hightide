import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { Select } from '@/src/components/user-interaction/select/Select'
import { SelectOption } from '@/src/components/user-interaction/select/SelectOption'

const meta = {
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>;

export const select: Story = {
  args: {
    initialValue: undefined,
    disabled: false,
    invalid: false,
    showSearch: false,
    readOnly: false,
    required: false,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
    children: [
      { value: 'Apple', label: 'Apple' },
      { value: 'Pear', label: 'Pear', disabled: true },
      { value: 'Strawberry', label: 'Strawberry' },
      { value: 'Pineapple', label: 'Pineapple' },
      { value: 'Blackberry', label: 'Blackberry' },
      { value: 'Blueberry', label: 'Blueberry', disabled: true },
      { value: 'Banana', label: 'Banana' },
      { value: 'Kiwi', label: 'Kiwi', disabled: true },
      { value: 'Maracuja', label: 'Maracuja', disabled: true },
      { value: 'Wildberry', label: 'Wildberry', disabled: true },
      { value: 'Watermelon', label: 'Watermelon' },
      { value: 'Honeymelon', label: 'Honeymelon' },
      { value: 'Papja', label: 'Papja' }
    ].sort((a, b) => a.value.localeCompare(b.value))
      .map((item, index) => (<SelectOption key={index} {...item} />)),
  },
}
