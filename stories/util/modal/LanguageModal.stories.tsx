import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { LanguageModal, SolidButton } from '../../../src'


/**
 * An implementation of the LanguageModal
 */
const LanguageModalExample = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <LanguageModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className="row items-center justify-center min-h-[400px]">
        <SolidButton onClick={() => setIsOpen(true)}>Show Modal</SolidButton>
      </div>
    </>
  )
}

const meta: Meta = {
  title: 'Util/Modal',
  component: LanguageModalExample,
}

export default meta
type Story = StoryObj<typeof meta>;

export const languageModal: Story = {
  render: () => <LanguageModalExample/>,
  args: {}
}
