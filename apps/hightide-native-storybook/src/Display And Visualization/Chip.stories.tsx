import type {
  Meta,
  StoryObj
} from '@storybook/react'
import { Text } from 'react-native'
import { action } from 'storybook/actions'

import {
  Chip,
  ChipUtil,
  Button,
  ButtonUtil,
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'
import type { ButtonState } from '@helpwave/hightide-native/theme'

const meta = {
  component: Chip,
  argTypes: {
    color: {
      control: 'select',
      options: ChipUtil.colors,
    },
    size: {
      control: 'select',
      options: ChipUtil.sizes,
    },
    coloringStyle: {
      control: 'select',
      options: ChipUtil.coloringStyles,
    },
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const chip: Story = {
  args: {
    color: 'primary',
    coloringStyle: 'filled',
    size: 'md',
    children: 'Label',
  },
}

type ChipInButtonArgs = {
  size: typeof ButtonUtil.sizes[number],
  color: typeof ButtonUtil.colors[number],
  coloringStyle: typeof ButtonUtil.coloringStyles[number],
  chipColor: typeof ChipUtil.colors[number],
  chipColoringStyle: typeof ChipUtil.coloringStyles[number],
  chipSize: typeof ChipUtil.sizes[number],
  chipLabel: string,
  label: string,
}

const ChipInButtonDemo = ({
  size,
  color,
  coloringStyle,
  chipColor,
  chipColoringStyle,
  chipSize,
  chipLabel,
  label,
}: ChipInButtonArgs) => {
  const { theme } = useTheme()
  const state: ButtonState = {
    size,
    color,
    coloringStyle,
  }
  const textStyle = theme.components.button.text(state)

  return (
    <Button
      size={size}
      color={color}
      coloringStyle={coloringStyle}
      onPress={action('Pressed')}
    >
      <>
        <Chip
          color={chipColor}
          coloringStyle={chipColoringStyle}
          size={chipSize}
        >
          {chipLabel}
        </Chip>
        <Text style={textStyle}>{label}</Text>
      </>
    </Button>
  )
}

export const chipInButton: StoryObj<ChipInButtonArgs> = {
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
    chipColor: {
      control: 'select',
      options: ChipUtil.colors,
    },
    chipColoringStyle: {
      control: 'select',
      options: ChipUtil.coloringStyles,
    },
    chipSize: {
      control: 'select',
      options: ChipUtil.sizes,
    },
    chipLabel: {
      control: 'text',
    },
    label: {
      control: 'text',
    },
  },
  args: {
    size: 'md',
    color: 'primary',
    coloringStyle: 'filled',
    chipColor: 'secondary',
    chipColoringStyle: 'tonal',
    chipSize: 'md',
    chipLabel: 'New',
    label: 'Filter',
  },
  render: (args) => <ChipInButtonDemo {...args} />,
}
