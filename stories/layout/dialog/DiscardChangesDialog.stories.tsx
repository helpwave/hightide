import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { action } from 'storybook/actions'
import { DiscardChangesDialog } from '../../../src/components/dialog/DiscardChangesDialog'
import { Button } from '../../../src/components/user-action/Button'

type DiscardChangesDialogExampleProps = {
  onDontSave: () => void,
  onSave: () => void,
  onCancel: () => void,
}

/**
 * An Example Component for the DiscardChangesDialog
 */
const DiscardChangesDialogExample = ({
                                      onDontSave,
                                      onSave,
                                      onCancel,
                                    }: DiscardChangesDialogExampleProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <DiscardChangesDialog
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
      <div className="flex-row-2 items-center justify-center min-h-[400px]">
        <Button onClick={() => setIsOpen(true)}>Show Dialog</Button>
      </div>
    </>
  )
}

const meta: Meta = {
  title: 'Layout/Dialog',
  component: DiscardChangesDialogExample,
} satisfies Meta<typeof DiscardChangesDialogExample>

export default meta
type Story = StoryObj<typeof meta>;

export const discardChangesDialog: Story = {
  args: {
    onDontSave: action('onDontSave'),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
  }
}
