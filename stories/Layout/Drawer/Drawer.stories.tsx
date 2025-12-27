import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { Drawer } from '../../../src/components/layout/Drawer'


const meta: Meta = {
  component: Drawer,
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>;

export const drawer: Story = {
  args: {
    isOpen: true,
    alignment: 'left',
    titleElement: 'This is the Title',
    description: 'Some descriptive Text',
    onClose: action('onClose'),
  }
}
