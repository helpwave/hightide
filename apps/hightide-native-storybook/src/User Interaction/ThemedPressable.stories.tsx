import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'
import { View } from 'react-native'

import {
  Avatar,
  ThemedIcon,
  ThemedPressable,
  ThemedPressableUtil,
  ThemedText
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'
import { HightideIconRegistry } from '@helpwave/hightide-native/icons'

import {
  type ColorPairKey,
  StorybookHelper
} from '../helper'

const meta = {
  component: ThemedPressable,
} satisfies Meta<typeof ThemedPressable>

export default meta

type ThemedPressableArgs = {
  label: string,
  disabled: boolean,
  color: ColorPairKey | 'default',
  size: typeof ThemedPressableUtil.sizes[number],
  coloringStyle: typeof ThemedPressableUtil.coloringStyles[number],
  coloringColorVariant: typeof ThemedPressableUtil.coloringColorVariants[number],
  hasAdditionalHorizontalPadding: boolean,
  withIcon: boolean,
}

const ThemedPressableDemo = ({
  label,
  disabled,
  color,
  size,
  coloringStyle,
  coloringColorVariant,
  hasAdditionalHorizontalPadding,
  withIcon,
}: ThemedPressableArgs) => {
  const { theme } = useTheme()

  return (
    <ThemedPressable
      disabled={disabled}
      color={color === 'default' ? undefined : theme.colors[color]}
      size={size}
      coloringStyle={coloringStyle}
      coloringColorVariant={coloringColorVariant}
      hasAdditionalHorizontalPadding={hasAdditionalHorizontalPadding}
      onPress={action('Pressed')}
    >
      {withIcon && <ThemedIcon icon={HightideIconRegistry.Plus} />}
      <ThemedText>{label}</ThemedText>
    </ThemedPressable>
  )
}

export const themedPressable: StoryObj<ThemedPressableArgs> = {
  argTypes: {
    label: {
      control: 'text',
    },
    color: {
      control: 'select',
      options: ['default', ...StorybookHelper.colorPairSelect.options],
    },
    size: {
      control: 'select',
      options: ThemedPressableUtil.sizes,
    },
    coloringStyle: {
      control: 'select',
      options: ThemedPressableUtil.coloringStyles,
    },
    coloringColorVariant: {
      control: 'select',
      options: ThemedPressableUtil.coloringColorVariants,
    },
    hasAdditionalHorizontalPadding: {
      control: 'boolean',
    },
    withIcon: {
      control: 'boolean',
    },
  },
  args: {
    label: 'Press me',
    disabled: false,
    color: 'default',
    size: 'md',
    coloringStyle: 'foreground',
    coloringColorVariant: 'normal',
    hasAdditionalHorizontalPadding: false,
    withIcon: true,
  },
  render: (args) => (
    <View>
      <ThemedPressableDemo {...args} />
    </View>
  ),
}

type WithAvatarArgs = {
  name: string,
  disabled: boolean,
  size: typeof ThemedPressableUtil.sizes[number],
  coloringStyle: typeof ThemedPressableUtil.coloringStyles[number],
  coloringColorVariant: typeof ThemedPressableUtil.coloringColorVariants[number],
  hasAdditionalHorizontalPadding: boolean,
}

export const withAvatar: StoryObj<WithAvatarArgs> = {
  argTypes: {
    name: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ThemedPressableUtil.sizes,
    },
    coloringStyle: {
      control: 'select',
      options: ThemedPressableUtil.coloringStyles,
    },
    coloringColorVariant: {
      control: 'select',
      options: ThemedPressableUtil.coloringColorVariants,
    },
    hasAdditionalHorizontalPadding: {
      control: 'boolean',
    },
  },
  args: {
    name: 'John Doe',
    disabled: false,
    size: 'md',
    coloringStyle: 'foreground',
    coloringColorVariant: 'normal',
    hasAdditionalHorizontalPadding: true,
  },
  render: ({
    name,
    disabled,
    size,
    coloringStyle,
    coloringColorVariant,
    hasAdditionalHorizontalPadding,
  }) => (
    <ThemedPressable
      disabled={disabled}
      size={size}
      coloringStyle={coloringStyle}
      coloringColorVariant={coloringColorVariant}
      hasAdditionalHorizontalPadding={hasAdditionalHorizontalPadding}
      onPress={action('Pressed')}
    >
      <Avatar
        name={name}
        size="md"
        image={{
          avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
          alt: 'profile picture',
        }}
      />
      <ThemedText>{name}</ThemedText>
    </ThemedPressable>
  ),
}
