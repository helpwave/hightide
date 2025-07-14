import type { Meta, StoryObj  } from '@storybook/nextjs'
import { useState } from 'react'
import { ThemeModal, SolidButton } from '../../../src'

/**
 * An implementation of the ThemeModal
 */
const ThemeModalExample = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ThemeModal
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
  title: 'Util/Modal',
  component: ThemeModalExample,
}

export default meta
type Story = StoryObj<typeof meta>;

export const themeModal: Story = {
  render: () => <ThemeModalExample/>,
  args: {}
}
