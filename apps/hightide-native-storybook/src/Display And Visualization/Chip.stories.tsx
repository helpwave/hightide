import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'

import {
  Chip,
  ChipUtil,
  Button,
  ButtonUtil,
  ThemedText
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'
import type { ButtonState } from '@helpwave/hightide-native/theme'

import {
  type ColorPairKey,
  StorybookHelper
} from '../helper'

const meta = {
  component: Chip,
} satisfies Meta<typeof Chip>

export default meta

type ChipArgs = {
  label: string,
  color: ColorPairKey,
  coloringStyle: typeof ChipUtil.coloringStyles[number],
  size: typeof ChipUtil.sizes[number],
}

const ChipDemo = ({
  label,
  color,
  coloringStyle,
  size,
}: ChipArgs) => {
  const { theme } = useTheme()

  return (
    <Chip
      color={theme.colors[color]}
      coloringStyle={coloringStyle}
      size={size}
    >
      {label}
    </Chip>
  )
}

export const chip: StoryObj<ChipArgs> = {
  argTypes: {
    label: {
      control: 'text',
    },
    color: StorybookHelper.colorPairSelect,
    coloringStyle: {
      control: 'select',
      options: ChipUtil.coloringStyles,
    },
    size: {
      control: 'select',
      options: ChipUtil.sizes,
    },
  },
  args: {
    label: 'Label',
    color: 'primary',
    coloringStyle: 'filled',
    size: 'md',
  },
  render: (args) => <ChipDemo {...args} />,
}

type ChipInButtonArgs = {
  size: typeof ButtonUtil.sizes[number],
  color: ColorPairKey,
  coloringStyle: typeof ButtonUtil.coloringStyles[number],
  chipColor: ColorPairKey,
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
    color: theme.colors[color],
    coloringStyle,
  }
  const textStyle = theme.components.button.text(state)

  return (
    <Button
      size={size}
      color={theme.colors[color]}
      coloringStyle={coloringStyle}
      onPress={action('Pressed')}
    >
      <>
        <Chip
          color={theme.colors[chipColor]}
          coloringStyle={chipColoringStyle}
          size={chipSize}
        >
          {chipLabel}
        </Chip>
        <ThemedText style={textStyle}>{label}</ThemedText>
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
    color: StorybookHelper.colorPairSelect,
    coloringStyle: {
      control: 'select',
      options: ButtonUtil.coloringStyles,
    },
    chipColor: StorybookHelper.colorPairSelect,
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
