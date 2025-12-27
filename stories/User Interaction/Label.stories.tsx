import type { Meta, StoryObj } from '@storybook/nextjs'
import { Label } from '../../src/components/display-and-visualization/Label'

const meta = {
  component: Label,
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>;

export const label: Story = {
  args: {
    children: 'LabelText',
    size: 'md',
    className: '',
  },
}
