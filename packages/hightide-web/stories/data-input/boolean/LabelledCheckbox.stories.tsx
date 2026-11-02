import type { Meta, StoryObj } from '@storybook/react-vite'
import { LabelledCheckbox } from '../../../src/components/data-input/boolean/LabelledCheckbox'
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
    isDisabled: false,
    isInvalid: false,
    isReadOnly: false,
    isRounded: false,
    size: 'md',
    alwaysShowCheckIcon: false,
    checkPosition: 'left',
    label: 'Accept terms and conditions',
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
    onClick: action('onClick'),
    onKeyDown: action('onKeyDown'),
  },
}
