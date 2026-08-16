import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'
import { View } from 'react-native'

import { iconSizes } from '@helpwave/hightide-design/theme-tokens'
import { HightideIconRegistry } from '@helpwave/hightide-native/icons'
import {
  ThemedIcon,
  Button,
  ButtonUtil
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'

import {
  type ColorPairKey,
  StorybookHelper
} from '../helper'

const iconAppearances = ['normal', 'subtle', 'faded'] as const

const meta = {
  component: ThemedIcon,
  argTypes: {
    size: {
      control: 'select',
      options: [...iconSizes],
    },
    appearance: {
      control: 'select',
      options: iconAppearances,
    },
  },
} satisfies Meta<typeof ThemedIcon>

export default meta
type Story = StoryObj<typeof meta>

const ThemedIconDemo = ({
  appearance,
}: {
  appearance: typeof iconAppearances[number],
}) => {
  const { theme } = useTheme()

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.lg }}>
      {iconSizes.map((size) => (
        <ThemedIcon
          key={size}
          icon={HightideIconRegistry.Plus}
          size={size}
          appearance={appearance}
          color={theme.colors.background.onColor}
        />
      ))}
    </View>
  )
}

export const themedIcon: Story = {
  args: {
    icon: HightideIconRegistry.Plus,
    size: 'md',
    appearance: 'normal',
  },
  render: ({ appearance }) => (
    <ThemedIconDemo
      appearance={(appearance ?? 'normal') as typeof iconAppearances[number]}
    />
  ),
}

type IconInButtonArgs = {
  size: typeof ButtonUtil.sizes[number],
  color: ColorPairKey,
  variant: typeof ButtonUtil.variants[number],
  label: string,
}

const IconInButtonDemo = ({
  size,
  color,
  variant,
  label,
}: IconInButtonArgs) => {
  const { theme } = useTheme()

  return (
    <Button
      size={size}
      color={theme.colors[color]}
      variant={variant}
      leadingIcon={HightideIconRegistry.Plus}
      onPress={action('Pressed')}
    >
      {label}
    </Button>
  )
}

export const iconInButton: StoryObj<IconInButtonArgs> = {
  argTypes: {
    size: {
      control: 'select',
      options: ButtonUtil.sizes,
    },
    color: StorybookHelper.colorPairSelect,
    variant: {
      control: 'select',
      options: ButtonUtil.variants,
    },
    label: {
      control: 'text',
    },
  },
  args: {
    size: 'md',
    color: 'primary',
    variant: 'filled',
    label: 'Add',
  },
  render: (args) => <IconInButtonDemo {...args} />,
}
