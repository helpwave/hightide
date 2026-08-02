import type {
  Meta,
  StoryObj
} from '@storybook/react'
import { HightideIconRegistry } from '@helpwave/hightide-native/icons'
import { action } from 'storybook/actions'

import {
  ButtonUtil,
  IconButton,
  Icon,
} from '@helpwave/hightide-native/components'

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
type Story = StoryObj<typeof meta>

export const iconButton: Story = {
  args: {
    disabled: false,
    color: 'primary',
    size: 'md',
    coloringStyle: 'filled',
    accessibilityLabel: 'Subtract',
    onPress: action('Pressed'),
    children: <Icon icon={HightideIconRegistry.Minus} />,
  },
}
