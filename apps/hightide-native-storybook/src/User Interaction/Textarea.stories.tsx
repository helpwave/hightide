import type { Meta, StoryObj } from '@storybook/react-native'
import { action } from 'storybook/actions'

import { Textarea } from '@helpwave/hightide-native/components'

const meta = {
  component: Textarea,
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const textarea: Story = {
  args: {
    initialValue: '',
    disabled: false,
    invalid: false,
    placeholder: 'Placeholder',
    editCompleteOptions: {
      onBlur: true,
      afterDelay: true,
      delay: 2500,
    },
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
