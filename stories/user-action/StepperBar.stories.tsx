import type { Meta, StoryObj } from '@storybook/nextjs'
import { StepperBarUncontrolled } from '../../src'
import { action } from 'storybook/actions'

const meta = {
  title: 'User Action',
  component: StepperBarUncontrolled,
} satisfies Meta<typeof StepperBarUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const stepperBar: Story = {
  args: {
    disabledSteps: new Set(),
    showDots: true,
    numberOfSteps: 5,
    finishText: 'Done',
    onFinish: action('onFinish'),
    onChange: action('onChange'),
  },
}
