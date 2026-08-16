import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'

import {
  Chip,
  ChipUtil,
  ThemedPressable,
  ThemedPressableUtil,
  ThemedText
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'

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

type ChipInPressableArgs = {
  size: typeof ThemedPressableUtil.sizes[number],
  color: ColorPairKey | 'default',
  coloringStyle: typeof ThemedPressableUtil.coloringStyles[number],
  coloringColorVariant: typeof ThemedPressableUtil.coloringColorVariants[number],
  hasAdditionalHorizontalPadding: boolean,
  chipColor: ColorPairKey,
  chipVariant: typeof ChipUtil.variants[number],
  chipSize: typeof ChipUtil.sizes[number],
  chipLabel: string,
  label: string,
}

const ChipInPressableDemo = ({
  size,
  color,
  coloringStyle,
  coloringColorVariant,
  hasAdditionalHorizontalPadding,
  chipColor,
  chipVariant,
  chipSize,
  chipLabel,
  label,
}: ChipInPressableArgs) => {
  const { theme } = useTheme()

  return (
    <ThemedPressable
      size={size}
      color={color === 'default' ? undefined : theme.colors[color]}
      coloringStyle={coloringStyle}
      coloringColorVariant={coloringColorVariant}
      hasAdditionalHorizontalPadding={hasAdditionalHorizontalPadding}
      onPress={action('Pressed')}
    >
      <Chip
        color={theme.colors[chipColor]}
        variant={chipVariant}
        size={chipSize}
      >
        {chipLabel}
      </Chip>
      <ThemedText>{label}</ThemedText>
    </ThemedPressable>
  )
}

export const chipInPressable: StoryObj<ChipInPressableArgs> = {
  argTypes: {
    size: {
      control: 'select',
      options: ThemedPressableUtil.sizes,
    },
    color: {
      control: 'select',
      options: ['default', ...StorybookHelper.colorPairSelect.options],
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
    color: 'default',
    coloringStyle: 'foreground',
    coloringColorVariant: 'normal',
    hasAdditionalHorizontalPadding: true,
    chipColor: 'secondary',
    chipVariant: 'tonal',
    chipSize: 'md',
    chipLabel: 'New',
    label: 'Filter',
  },
  render: (args) => <ChipInPressableDemo {...args} />,
}
