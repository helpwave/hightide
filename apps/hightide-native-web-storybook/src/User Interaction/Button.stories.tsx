import type {
  Meta,
  StoryObj
} from '@storybook/react'
import { action } from 'storybook/actions'

import { Button, ButtonUtil } from '@helpwave/hightide-native/components'

const meta = {
  component: Button,
  argTypes: {
    color: {
      control: 'select',
      options: ButtonUtil.colors,
    },
    size: {
      control: 'select',
      options: ButtonUtil.sizes,
    },
    coloringStyle: {
      control: 'select',
      options: ButtonUtil.coloringStyles,
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const button: Story = {
  args: {
    children: 'Test',
    disabled: false,
    color: 'primary',
    size: 'md',
    coloringStyle: 'filled',
    onPress: action('Pressed'),
  },
}
