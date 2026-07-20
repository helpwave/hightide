import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LabelledCheckbox } from '@/src/components/user-interaction/LabelledCheckbox'
import { action } from 'storybook/actions'

const meta: Meta<typeof LabelledCheckbox> = {
  component: LabelledCheckbox,
}

export default meta
type Story = StoryObj<typeof meta>

export const labelledCheckbox: Story = {
  args: {
    initialValue: false,
    indeterminate: false,
    disabled: false,
    invalid: false,
    readOnly: false,
    isRounded: false,
    size: 'md',
    alwaysShowCheckIcon: false,
    checkPosition: 'left',
    label: 'Accept terms and conditions',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
    onClick: action('onClick'),
    onKeyDown: action('onKeyDown'),
  },
}
