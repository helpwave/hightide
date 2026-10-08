import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus } from 'lucide-react'
import { ButtonUtil } from '../../src/components/interaction/Pressable'
import { Pressable } from '../../src/components/interaction/Pressable'
import { action } from 'storybook/actions'

const meta = {
  component: Pressable,
  argTypes: {
    color: {
      control: 'select',
      options: ButtonUtil.colors,
    },
  },
} satisfies Meta<typeof Pressable>

export default meta
type Story = StoryObj<typeof meta>;

export const pressable: Story = {
  args: {
    children: 'Label',
    disabled: false,
    isProcessing: false,
    color: 'primary',
    size: 'md',
    coloringStyle: 'filled',
    onClick: action('Clicked'),
  },
  render: ({ children, ...props }) => {
    return (
      <div className="flex-row-2 items-center">
        <Pressable {...props}>
          {children}
        </Pressable>
        <Pressable {...props} aria-label="Add">
          <Plus />
        </Pressable>
      </div>
    )
  }
}
