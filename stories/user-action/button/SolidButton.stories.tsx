import type { Meta, StoryObj } from '@storybook/nextjs'
import { SolidButton } from '../../../src/components/user-action/Button'
import { action } from 'storybook/actions'
import { StorybookHelper } from '../../../src/storybook/helper'

const meta = {
  title: 'User Action/Button',
  component: SolidButton,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'positive', 'warning', 'negative', 'neutral'],
    },
    startIcon: StorybookHelper.iconSelect,
    endIcon: StorybookHelper.iconSelect,
  },
} satisfies Meta<typeof SolidButton>

export default meta
type Story = StoryObj<typeof meta>;

export const solidButton: Story = {
  args: {
    children: 'Test',
    color: 'primary',
    size: 'medium',
    disabled: false,
    onClick: action('Clicked'),
  },
}
