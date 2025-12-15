import type { Meta, StoryObj } from '@storybook/nextjs'
import type { ButtonProps } from '../../../src/components/user-action/Button'
import { ButtonUtil } from '../../../src/components/user-action/Button'
import { Button } from '../../../src/components/user-action/Button'
import { action } from 'storybook/actions'
import { StorybookHelper } from '../../../src/storybook/helper'
import { PlusIcon } from 'lucide-react'

const ExampleButton = ({ children, layout, ...props }: ButtonProps) => {
  return (
    <Button
      {...props}
      layout={layout}
    >
      {layout === 'icon' ? <PlusIcon/> : children}
    </Button>
  )
}

const meta = {
  title: 'User Action/Button',
  component: ExampleButton,
  argTypes: {
    color: {
      control: 'select',
      options: ButtonUtil.colors,
    },
    startIcon: StorybookHelper.iconSelect,
    endIcon: StorybookHelper.iconSelect,
  },
} satisfies Meta<typeof ExampleButton>

export default meta
type Story = StoryObj<typeof meta>;

export const button: Story = {
  args: {
    children: 'Test',
    color: 'primary',
    size: 'medium',
    coloringStyle: 'solid',
    layout: 'default',
    disabled: false,
    onClick: action('Clicked'),
  },
}
