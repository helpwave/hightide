import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'

import { Button, ButtonUtil } from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'

import {
  type ColorPairKey,
  StorybookHelper
} from '../helper'

const meta = {
  component: Button,
} satisfies Meta<typeof Button>

export default meta

type ButtonArgs = {
  label: string,
  disabled: boolean,
  color: ColorPairKey,
  size: typeof ButtonUtil.sizes[number],
  coloringStyle: typeof ButtonUtil.coloringStyles[number],
}

const ButtonDemo = ({
  label,
  disabled,
  color,
  size,
  coloringStyle,
}: ButtonArgs) => {
  const { theme } = useTheme()

  return (
    <Button
      disabled={disabled}
      color={theme.colors[color]}
      size={size}
      coloringStyle={coloringStyle}
      onPress={action('Pressed')}
    >
      {label}
    </Button>
  )
}

export const button: StoryObj<ButtonArgs> = {
  argTypes: {
    label: {
      control: 'text',
    },
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
    label: 'Test',
    disabled: false,
    color: 'primary',
    size: 'md',
    coloringStyle: 'filled',
  },
  render: (args) => <ButtonDemo {...args} />,
}
