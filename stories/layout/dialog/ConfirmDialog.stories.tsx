import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { ConfirmDialog, SolidButton } from '../../../src'
import { action } from 'storybook/actions'


type ConfirmDialogExampleProps = {
  onDecline: () => void,
  onConfirm: () => void,
}

/**
 * An Example Component for the ConfirmModal
 */
const ConfirmDialogExample = ({
                               onDecline,
                               onConfirm,
                             }: ConfirmDialogExampleProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ConfirmDialog
        isOpen={isOpen}
        onConfirm={() => {
          onConfirm()
          setIsOpen(false)
        }}
        onDecline={() => {
          onDecline()
          setIsOpen(false)
        }}
        headerProps={{ titleText: 'Confirmation Required' }}
      />
      <div className="flex-row-2 items-center justify-center min-h-[400px]">
        <SolidButton onClick={() => setIsOpen(true)}>Show Dialog</SolidButton>
      </div>
    </>
  )
}

const meta: Meta = {
  title: 'Layout/Dialog',
  component: ConfirmDialogExample,
} satisfies Meta<typeof ConfirmDialogExample>

export default meta
type Story = StoryObj<typeof meta>;

export const confirmDialog: Story = {
  args: {
    onDecline: action('onDecline'),
    onConfirm: action('onConfirm'),
  }
}
