import type { Meta, StoryObj } from '@storybook/nextjs'
import { ButtonColorUtil, LoadingButton } from '../../../src'

const meta = {
  title: 'User Action/Button',
  component: LoadingButton,
  argTypes: {
    color: {
      control: 'select',
      options: ButtonColorUtil.solid,
    }
  },
} satisfies Meta<typeof LoadingButton>

export default meta
type Story = StoryObj<typeof meta>;

export const loadingButton: Story = {
  args: {
    children: 'Modify my `isLoading` properties',
    color: 'primary',
    size: 'medium',
    disabled: false,
    isLoading: false,
  },
}
