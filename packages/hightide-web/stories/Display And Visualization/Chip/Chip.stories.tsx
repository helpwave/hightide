import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Chip, ChipUtil } from '../../../src/components/display-and-visualization/Chip'

const meta = {
  component: Chip,
  argTypes: {
    color: {
      control: 'select',
      options: ChipUtil.colors,
    },
    colorVariant: {
      control: 'select',
      options: ChipUtil.colorVariants,
    },
    coloringStyle: {
      control: 'select',
      options: ChipUtil.styles,
    },
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>;

export const chip: Story = {
  args: {
    color: 'primary',
    colorVariant: 'tonal',
    coloringStyle: 'filled',
    size: 'md',
    children: 'Label',
  },
}
