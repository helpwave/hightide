import type { Meta, StoryObj } from '@storybook/nextjs'
import { ButtonUtil } from '../../../src/components/user-action/Button'
import { LoadingButton } from '../../../src/components/loading-states/LoadingButton'

const meta = {
  title: 'User Action/Button',
  component: LoadingButton,
  argTypes: {
    color: {
      control: 'select',
      options: ButtonUtil.colors,
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
