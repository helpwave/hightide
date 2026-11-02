import { action } from 'storybook/actions'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { InsideLabelInput } from '../../../src/components/data-input/text/InsideLabelInput'
import { clsx } from 'clsx'

const meta = {
  component: InsideLabelInput,
} satisfies Meta<typeof InsideLabelInput>

export default meta
type Story = StoryObj<typeof meta>;

export const insideLabelInput: Story = {
  args: {
    initialValue: 'Text',
    label: (
      <span className={clsx('text-description')}>
        Input Label
      </span>
    ),
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
  },
}
