import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { useEffect, useState } from 'react'
import type { ConfirmDialogProps } from '../../../src/components/dialog'
import { ConfirmDialog } from '../../../src/components/dialog'
import { SolidButton } from '../../../src/components/user-action/Button'


/**
 * An Example Component for the ConfirmModal
 */
const ConfirmDialogExample = ({
                                isOpen: initialIsOpen,
                                onDecline,
                                onConfirm,
                                ...props
                              }: ConfirmDialogProps) => {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    setIsOpen(initialIsOpen)
  }, [initialIsOpen])

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
        onClose={() => {
          props.onClose?.()
          setIsOpen(false)
        }}
        {...props}
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
    isOpen: true,
    isModal: true,
    title: 'Do you want to confirm this?',
    description: 'Whatever you click only closes the Dialog',
    onDecline: action('onDecline'),
    onConfirm: action('onConfirm'),
  }
}
