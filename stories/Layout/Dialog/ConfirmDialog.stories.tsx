import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { ConfirmDialog } from '@/src/components/layout/dialog/ConfirmDialog'


const meta: Meta = {
  component: ConfirmDialog,
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>;

export const confirmDialog: Story = {
  args: {
    isOpen: true,
    isModal: true,
    titleElement: 'Do you want to confirm this?',
    description: 'Whatever you click only closes the Dialog',
    onDecline: action('onDecline'),
    onConfirm: action('onConfirm'),
    onCancel: action('onCancel'),
  }
}
