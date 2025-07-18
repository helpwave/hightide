import type { Meta, StoryObj } from '@storybook/nextjs'
import { SolidButton } from '../../../src'
import { action } from 'storybook/actions'
// @ts-expect-error The StorybookHelper should not be exported
import { StorybookHelper } from '../../helper'

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
