import type { Meta, StoryObj } from '@storybook/nextjs'
import { Switch as SwitchComponent } from '@/src/components/user-interaction/Switch'
import { action } from 'storybook/actions'

const meta = {
  component: SwitchComponent,
} satisfies Meta<typeof SwitchComponent>

export default meta
type Story = StoryObj<typeof meta>;

export const Switch: Story = {
  args: {
    initialValue: true,
    disabled: false,
    invalid: false,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}


