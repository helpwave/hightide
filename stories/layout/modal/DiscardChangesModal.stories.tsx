import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { DiscardChangesModal, SolidButton } from '../../../src'
import { action } from 'storybook/actions'


type DiscardChangesModalExampleProps = {
  onDontSave: () => void,
  onSave: () => void,
  onCancel: () => void,
}

/**
 * An Example Component for the DiscardChangesModal
 */
const DiscardChangesModalExample = ({
                                      onDontSave,
                                      onSave,
                                      onCancel,
                                    }: DiscardChangesModalExampleProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <DiscardChangesModal
        isOpen={isOpen}
        onCancel={() => {
          onCancel()
          setIsOpen(false)
        }}
        onSave={() => {
          onSave()
          setIsOpen(false)
        }}
        onDontSave={() => {
          onDontSave()
          setIsOpen(false)
        }}
      />
      <div className="row items-center justify-center min-h-[400px]">
        <SolidButton onClick={() => setIsOpen(true)}>Show Modal</SolidButton>
      </div>
    </>
  )
}

const meta: Meta = {
  title: 'Layout/Modal',
  component: DiscardChangesModalExample,
} satisfies Meta<typeof DiscardChangesModalExample>

export default meta
type Story = StoryObj<typeof meta>;

export const discardChangesModal: Story = {
  args: {
    onDontSave: action('onDontSave'),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
  }
}
