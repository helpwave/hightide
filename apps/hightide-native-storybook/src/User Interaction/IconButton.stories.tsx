import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { HightideIconRegistry } from '@helpwave/hightide-native/icons'
import { action } from 'storybook/actions'

import {
  ButtonUtil,
  IconButton
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'

import {
  type ColorPairKey,
  StorybookHelper
} from '../helper'

const meta = {
  component: IconButton,
} satisfies Meta<typeof IconButton>

export default meta

type IconButtonArgs = {
  disabled: boolean,
  color: ColorPairKey,
  size: typeof ButtonUtil.sizes[number],
  variant: typeof ButtonUtil.variants[number],
}

const IconButtonDemo = ({
  disabled,
  color,
  size,
  variant,
}: IconButtonArgs) => {
  const { theme } = useTheme()

  return (
    <IconButton
      icon={HightideIconRegistry.Minus}
      disabled={disabled}
      color={theme.colors[color]}
      size={size}
      variant={variant}
      accessibilityLabel="Subtract"
      onPress={action('Pressed')}
    />
  )
}

export const iconButton: StoryObj<IconButtonArgs> = {
  argTypes: {
    color: StorybookHelper.colorPairSelect,
    size: {
      control: 'select',
      options: ButtonUtil.sizes,
    },
    variant: {
      control: 'select',
      options: ButtonUtil.variants,
    },
  },
  args: {
    disabled: false,
    color: 'primary',
    size: 'md',
    variant: 'filled',
  },
  render: (args) => <IconButtonDemo {...args} />,
}
