import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Check, ChevronRight } from 'lucide-react'
import { ButtonUtil } from '../../src/components/user-interaction/Button'
import { Button } from '../../src/components/user-interaction/Button'
import { action } from 'storybook/actions'

const meta = {
  component: Button,
  argTypes: {
    color: {
      control: 'select',
      options: ButtonUtil.colors,
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>;

export const button: Story = {
  args: {
    children: 'Test',
    disabled: false,
    isProcessing: false,
    color: 'primary',
    size: 'md',
    coloringStyle: 'solid',
    onClick: action('Clicked'),
  },
  render: ({ children, ...props }) => {
    return (
      <div className="flex-row-2 items-center">
        <Button {...props}>
          {children}
        </Button>
        <Button {...props} leading={Check}>
          {children}
        </Button>
        <Button {...props} trailing={ChevronRight}>
          {children}
        </Button>
      </div>
    )
  }
}
