import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { HightideIconRegistry } from '@helpwave/hightide-native/icons'
import { action } from 'storybook/actions'

import {
  IconButton,
  IconButtonUtil
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
  isProcessing: boolean,
  color: ColorPairKey,
  size: typeof IconButtonUtil.sizes[number],
  variant: typeof IconButtonUtil.variants[number],
}

const IconButtonDemo = ({
  disabled,
  isProcessing,
  color,
  size,
  variant,
}: IconButtonArgs) => {
  const { theme } = useTheme()

  return (
    <IconButton
      icon={HightideIconRegistry.Minus}
      disabled={disabled}
      isProcessing={isProcessing}
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
      options: IconButtonUtil.sizes,
    },
    variant: {
      control: 'select',
      options: IconButtonUtil.variants,
    },
  },
  args: {
    disabled: false,
    isProcessing: false,
    color: 'primary',
    size: 'md',
    variant: 'filled',
  },
  render: (args) => <IconButtonDemo {...args} />,
}
