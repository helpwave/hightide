import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { ConfirmModal, SolidButton } from '../../../src'
import { action } from 'storybook/actions'


type ConfirmModalExampleProps = {
  onDecline: () => void,
  onConfirm: () => void,
  onCancel: () => void,
}

/**
 * An Example Component for the ConfirmModal
 */
const ConfirmModalExample = ({
                               onDecline,
                               onConfirm,
                               onCancel,
                             }: ConfirmModalExampleProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ConfirmModal
        isOpen={isOpen}
        onCancel={() => {
          onCancel()
          setIsOpen(false)
        }}
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
        <SolidButton onClick={() => setIsOpen(true)}>Show Modal</SolidButton>
      </div>
    </>
  )
}

const meta: Meta = {
  title: 'Layout/Modal',
  component: ConfirmModalExample,
} satisfies Meta<typeof ConfirmModalExample>

export default meta
type Story = StoryObj<typeof meta>;

export const confirmModal: Story = {
  args: {
    onDecline: action('onDecline'),
    onConfirm: action('onConfirm'),
    onCancel: action('onCancel'),
  }
}
