import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { ConfirmModal } from '../../../src/components/layout/Modal/ConfirmModal'


const meta: Meta = {
  component: ConfirmModal,
} satisfies Meta<typeof ConfirmModal>

export default meta
type Story = StoryObj<typeof meta>;

export const confirmModal: Story = {
  args: {
    isOpen: true,
    titleElement: 'Do you want to confirm this?',
    description: 'Whatever you click only closes the modal',
    onDecline: action('onDecline'),
    onConfirm: action('onConfirm'),
    onCancel: action('onCancel'),
  }
}
