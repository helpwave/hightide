import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { DiscardChangesDialog } from '@/src/components/layout/dialog/premade/DiscardChangesDialog'

const meta: Meta = {
  component: DiscardChangesDialog,
} satisfies Meta<typeof DiscardChangesDialog>

export default meta
type Story = StoryObj<typeof meta>;

export const discardChangesDialog: Story = {
  args: {
    isOpen: true,
    onDontSave: action('onDontSave'),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
  }
}
