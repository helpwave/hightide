import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { DiscardChangesModal } from '../../../src/components/layout/Modal/premade/DiscardChangesModal'

const meta: Meta = {
  component: DiscardChangesModal,
} satisfies Meta<typeof DiscardChangesModal>

export default meta
type Story = StoryObj<typeof meta>;

export const discardChangesModal: Story = {
  args: {
    isOpen: true,
    onDontSave: action('onDontSave'),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
  }
}
