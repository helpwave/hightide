import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { Select } from '@/src/components/user-interaction/select/Select'
import { SelectOption } from '@/src/components/user-interaction/select/SelectComponents'

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
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
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
