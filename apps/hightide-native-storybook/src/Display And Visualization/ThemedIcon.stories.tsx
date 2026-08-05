import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { View } from 'react-native'
import { action } from 'storybook/actions'

import { HightideIconRegistry } from '@helpwave/hightide-native/icons'
import {
  ThemedIcon,
  ThemedText,
  Button,
  ButtonUtil
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'
import type { ButtonState } from '@helpwave/hightide-native/theme'

import {
  type ColorPairKey,
  StorybookHelper
} from '../helper'

const iconSizes = ['sm', 'md', 'lg'] as const
const iconAppearances = ['normal', 'subtle', 'faded'] as const

const meta = {
  component: ThemedIcon,
  argTypes: {
    size: {
      control: 'select',
      options: iconSizes,
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
  size,
  appearance,
}: {
  size: typeof iconSizes[number],
  appearance: typeof iconAppearances[number],
}) => {
  const { theme } = useTheme()

  return (
    <ThemedIcon
      icon={HightideIconRegistry.Plus}
      size={size}
      appearance={appearance}
      color={theme.colors.background.onColor}
    />
  )
}

export const themedIcon: Story = {
  args: {
    icon: HightideIconRegistry.Plus,
    size: 'md',
    appearance: 'normal',
  },
  render: ({ size, appearance }) => (
    <ThemedIconDemo
      size={(size ?? 'md') as typeof iconSizes[number]}
      appearance={(appearance ?? 'normal') as typeof iconAppearances[number]}
    />
  ),
}

type IconInButtonArgs = {
  size: typeof ButtonUtil.sizes[number],
  color: ColorPairKey,
  coloringStyle: typeof ButtonUtil.coloringStyles[number],
  label: string,
}

const IconInButtonDemo = ({
  size,
  color,
  coloringStyle,
  label,
}: IconInButtonArgs) => {
  const { theme } = useTheme()
  const state: ButtonState = {
    size,
    color: theme.colors[color],
    coloringStyle,
  }
  const textStyle = theme.components.button.text(state)
  const iconColor = typeof textStyle.color === 'string' ? textStyle.color : undefined

  return (
    <Button
      size={size}
      color={theme.colors[color]}
      coloringStyle={coloringStyle}
      onPress={action('Pressed')}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <ThemedIcon
          icon={HightideIconRegistry.Plus}
          size={size}
          color={iconColor}
        />
        <ThemedText style={textStyle}>{label}</ThemedText>
      </View>
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
    coloringStyle: {
      control: 'select',
      options: ButtonUtil.coloringStyles,
    },
    label: {
      control: 'text',
    },
  },
  args: {
    size: 'md',
    color: 'primary',
    coloringStyle: 'filled',
    label: 'Add',
  },
  render: (args) => <IconInButtonDemo {...args} />,
}
