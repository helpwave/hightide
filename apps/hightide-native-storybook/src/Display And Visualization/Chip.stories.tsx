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
  variant: typeof ChipUtil.variants[number],
  size: typeof ChipUtil.sizes[number],
}

const ChipDemo = ({
  label,
  color,
  variant,
  size,
}: ChipArgs) => {
  const { theme } = useTheme()

  return (
    <Chip
      color={theme.colors[color]}
      variant={variant}
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
    variant: {
      control: 'select',
      options: ChipUtil.variants,
    },
    size: {
      control: 'select',
      options: ChipUtil.sizes,
    },
  },
  args: {
    label: 'Label',
    color: 'primary',
    variant: 'filled',
    size: 'md',
  },
  render: (args) => <ChipDemo {...args} />,
}

type ChipInButtonArgs = {
  size: typeof ButtonUtil.sizes[number],
  color: ColorPairKey,
  variant: typeof ButtonUtil.variants[number],
  chipColor: ColorPairKey,
  chipVariant: typeof ChipUtil.variants[number],
  chipSize: typeof ChipUtil.sizes[number],
  chipLabel: string,
  label: string,
}

const ChipInButtonDemo = ({
  size,
  color,
  variant,
  chipColor,
  chipVariant,
  chipSize,
  chipLabel,
  label,
}: ChipInButtonArgs) => {
  const { theme } = useTheme()
  const state: ButtonState = {
    size,
    color: theme.colors[color],
    variant,
  }
  const textStyle = theme.components.button.text(state)

  return (
    <Button
      size={size}
      color={theme.colors[color]}
      variant={variant}
      onPress={action('Pressed')}
    >
      <>
        <Chip
          color={theme.colors[chipColor]}
          variant={chipVariant}
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
    variant: {
      control: 'select',
      options: ButtonUtil.variants,
    },
    chipColor: StorybookHelper.colorPairSelect,
    chipVariant: {
      control: 'select',
      options: ChipUtil.variants,
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
    variant: 'filled',
    chipColor: 'secondary',
    chipVariant: 'tonal',
    chipSize: 'md',
    chipLabel: 'New',
    label: 'Filter',
  },
  render: (args) => <ChipInButtonDemo {...args} />,
}
