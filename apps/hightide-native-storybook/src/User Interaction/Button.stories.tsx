import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'

import { Button, ButtonUtil } from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'
import { HightideIconRegistry } from '@helpwave/hightide-native/icons'

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
  isProcessing: boolean,
  color: ColorPairKey,
  size: typeof ButtonUtil.sizes[number],
  variant: typeof ButtonUtil.variants[number],
  leadingIcon: boolean,
  trailingIcon: boolean,
}

const ButtonDemo = ({
  label,
  disabled,
  isProcessing,
  color,
  size,
  variant,
  leadingIcon,
  trailingIcon,
}: ButtonArgs) => {
  const { theme } = useTheme()

  return (
    <Button
      disabled={disabled}
      isProcessing={isProcessing}
      color={theme.colors[color]}
      size={size}
      variant={variant}
      leadingIcon={leadingIcon ? HightideIconRegistry.Plus : undefined}
      trailingIcon={trailingIcon ? HightideIconRegistry.ChevronRight : undefined}
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
    variant: {
      control: 'select',
      options: ButtonUtil.variants,
    },
    leadingIcon: {
      control: 'boolean',
    },
    trailingIcon: {
      control: 'boolean',
    },
  },
  args: {
    label: 'Test',
    disabled: false,
    isProcessing: false,
    color: 'primary',
    size: 'md',
    variant: 'filled',
    leadingIcon: false,
    trailingIcon: false,
  },
  render: (args) => <ButtonDemo {...args} />,
}
