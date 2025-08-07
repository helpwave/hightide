import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import {
  SearchableSelectUncontrolled
} from '../../../src/components/user-action/select/SearchableSelect'

const meta = {
  title: 'User Action/Select',
  component: SearchableSelectUncontrolled,
} satisfies Meta<typeof SearchableSelectUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const searchableSelect: Story = {
  args: {
    disabled: false,
    onChange: action('updated'),
    options: [
      { value: 'Apple' },
      { value: 'Pear', disabled: true },
      { value: 'Strawberry' },
      { value: 'Pineapple-styled' },
      { value: 'Blackberry' },
      { value: 'Blueberry', disabled: true }
    ],
  },
}
