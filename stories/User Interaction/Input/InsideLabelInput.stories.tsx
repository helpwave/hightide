import { action } from 'storybook/actions'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { InsideLabelInput } from '@/src/components/user-interaction/input/InsideLabelInput'
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
    onChange: action('onChange'),
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
