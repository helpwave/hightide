import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { StepperBarUncontrolled } from '../../src/components/navigation/StepperBar'

const meta = {
  title: 'User Action',
  component: StepperBarUncontrolled,
} satisfies Meta<typeof StepperBarUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const stepperBar: Story = {
  args: {
    showDots: true,
    numberOfSteps: 5,
    finishText: 'Done',
    onFinish: action('onFinish'),
    onChange: action('onChange'),
    disabledSteps: new Set(),
  },
}
