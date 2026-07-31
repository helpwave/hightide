import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import {
  Text,
  View
} from 'react-native'
import { action } from 'storybook/actions'

import { HightideIconRegistry } from '../../src/icons/HightideIconRegistry'
import { Icon } from '../../src/components/visualization-and-display/Icon'
import {
  Button,
  ButtonUtil
} from '../../src/components/user-interaction/Button'
import { useTheme } from '../../src/global-contexts/theme/ThemeContext'
import type { ButtonState } from '../../src/theme/types/components/button'

const iconSizes = ['sm', 'md', 'lg'] as const

const meta = {
  component: Icon,
  argTypes: {
    size: {
      control: 'select',
      options: iconSizes,
    },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

const IconDemo = ({
  size,
}: {
  size: typeof iconSizes[number],
}) => {
  const { theme } = useTheme()

  return (
    <Icon
      icon={HightideIconRegistry.Plus}
      size={size}
      color={theme.colors.onBackground}
    />
  )
}

export const icon: Story = {
  args: {
    icon: HightideIconRegistry.Plus,
    size: 'md',
  },
  render: ({ size }) => (
    <IconDemo size={(size ?? 'md') as typeof iconSizes[number]} />
  ),
}

type IconInButtonArgs = {
  size: typeof ButtonUtil.sizes[number],
  color: typeof ButtonUtil.colors[number],
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
    color,
    coloringStyle,
  }
  const textStyle = theme.components.button.text(state)
  const iconColor = typeof textStyle.color === 'string' ? textStyle.color : undefined

  return (
    <Button
      size={size}
      color={color}
      coloringStyle={coloringStyle}
      onPress={action('Pressed')}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon
          icon={HightideIconRegistry.Plus}
          size={size}
          color={iconColor}
        />
        <Text style={textStyle}>{label}</Text>
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
    color: {
      control: 'select',
      options: ButtonUtil.colors,
    },
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
