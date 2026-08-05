import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { HightideIconRegistry } from '@helpwave/hightide-native/icons'
import { action } from 'storybook/actions'

import {
  ButtonUtil,
  IconButton,
  ThemedIcon
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
  coloringStyle: typeof ButtonUtil.coloringStyles[number],
}

const IconButtonDemo = ({
  disabled,
  color,
  size,
  coloringStyle,
}: IconButtonArgs) => {
  const { theme } = useTheme()

  return (
    <IconButton
      disabled={disabled}
      color={theme.colors[color]}
      size={size}
      coloringStyle={coloringStyle}
      accessibilityLabel="Subtract"
      onPress={action('Pressed')}
    >
      <ThemedIcon icon={HightideIconRegistry.Minus} />
    </IconButton>
  )
}

export const iconButton: StoryObj<IconButtonArgs> = {
  argTypes: {
    color: StorybookHelper.colorPairSelect,
    size: {
      control: 'select',
      options: ButtonUtil.sizes,
    },
    coloringStyle: {
      control: 'select',
      options: ButtonUtil.coloringStyles,
    },
  },
  args: {
    disabled: false,
    color: 'primary',
    size: 'md',
    coloringStyle: 'filled',
  },
  render: (args) => <IconButtonDemo {...args} />,
}
