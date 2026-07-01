import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { Chip, ChipList, coloringRoles, coloringStyles } from '../src'

const meta = {
  title: 'Components/Chip',
  component: Chip,
  argTypes: {
    color: { control: 'select', options: coloringRoles },
    coloringStyle: { control: 'select', options: coloringStyles },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { color: 'primary', coloringStyle: 'solid', size: 'md', children: 'Label' },
}

export const List: StoryObj<typeof ChipList> = {
  render: () => (
    <ChipList
      list={[
        { children: 'Urgent', color: 'negative' },
        { children: 'Review', color: 'warning', coloringStyle: 'tonal' },
        { children: 'Done', color: 'positive', coloringStyle: 'tonal' },
        { children: 'Draft', color: 'neutral', coloringStyle: 'outline' },
      ]}
    />
  ),
}
