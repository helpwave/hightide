import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { SolidButton } from '../../../src'
import { LanguageDialog } from '../../../src'


/**
 * An implementation of the LanguageModal
 */
const LanguageModalExample = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <LanguageDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className="flex-row-2 items-center justify-center min-h-[400px]">
        <SolidButton onClick={() => setIsOpen(true)}>Show Modal</SolidButton>
      </div>
    </>
  )
}

const meta: Meta = {
  title: 'Util/Dialog',
  component: LanguageModalExample,
}

export default meta
type Story = StoryObj<typeof meta>;

export const languageModal: Story = {
  render: () => <LanguageModalExample/>,
  args: {}
}
