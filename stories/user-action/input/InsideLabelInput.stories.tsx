import { action } from 'storybook/actions'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { InsideLabelInputUncontrolled } from '../../../src/components/user-action/input/InsideLabelInput'
import { clsx } from 'clsx'

const meta = {
  title: 'User-Action/Input',
  component: InsideLabelInputUncontrolled,
} satisfies Meta<typeof InsideLabelInputUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const insideLabelInput: Story = {
  args: {
    value: 'Text',
    label: (
      <span className={clsx('text-description')}>
        Input Label
      </span>
    ),
    onChange: action('onChange'),
    onChangeText: action('onChangeText'),
    onEditCompleted: action('onEditCompleted'),
  },
}
