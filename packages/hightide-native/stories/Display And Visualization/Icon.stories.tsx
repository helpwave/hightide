import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import { Plus } from 'lucide-react-native'
import { Text } from 'react-native'
import { action } from 'storybook/actions'

import { Icon } from '../../src/components/visualization-and-display/Icon'
import { IconConstrainer } from '../../src/components/visualization-and-display/IconConstrainer'
import {
  Button,
  ButtonUtil
} from '../../src/components/user-interaction/Button'
import { useTheme } from '../../src/global-contexts/theme/ThemeContext'
import type { ButtonState } from '../../src/theme/types/components/button'

const iconSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

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
    <IconConstrainer size={size}>
      <Icon
        icon={Plus}
        size={size}
        color={theme.colors.onBackground}
      />
    </IconConstrainer>
  )
}

export const icon: Story = {
  args: {
    icon: Plus,
    size: 'md',
  },
  render: ({ size }) => (
    <IconDemo size={(size ?? 'md') as typeof iconSizes[number]} />
  ),
}

type IconInButtonArgs = {
  size: typeof iconSizes[number],
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
      <>
        <IconConstrainer size={size}>
          <Icon
            icon={Plus}
            size={size}
            color={iconColor}
          />
        </IconConstrainer>
        <Text style={textStyle}>{label}</Text>
      </>
    </Button>
  )
}

export const iconInButton: StoryObj<IconInButtonArgs> = {
  argTypes: {
    size: {
      control: 'select',
      options: iconSizes,
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
