import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { StepperBar } from '@/src/components/layout/navigation/StepperBar'

const meta = {
  component: StepperBar,
} satisfies Meta<typeof StepperBar>

export default meta
type Story = StoryObj<typeof meta>;

export const stepperBar: Story = {
  args: {
    showDots: true,
    numberOfSteps: 5,
    finishText: 'Done',
    onFinish: action('onFinish'),
    onStateChange: action('onChange'),
    disabledSteps: new Set(),
  },
}
