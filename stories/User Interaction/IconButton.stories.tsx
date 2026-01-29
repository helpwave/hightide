import type { Meta, StoryObj } from '@storybook/nextjs'
import { ButtonUtil } from '@/src/components/user-interaction/Button'
import { action } from 'storybook/actions'
import { IconButton } from '@/src/components/user-interaction/IconButton'
import { MinusIcon } from 'lucide-react'

const meta = {
  component: IconButton,
  argTypes: {
    color: {
      control: 'select',
      options: ButtonUtil.colors,
    },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>;

export const iconButton: Story = {
  args: {
    disabled: false,
    color: 'primary',
    size: 'md',
    coloringStyle: 'solid',
    tooltip: 'Subtract',
    onClick: action('Clicked'),
    children: <MinusIcon className="size-4"/>,
  },
  render: ({ children, ...props }) => {
    return (
      <IconButton {...props}>
        {children}
      </IconButton>
    )
  }
}
