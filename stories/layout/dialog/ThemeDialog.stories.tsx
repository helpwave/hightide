import type { Meta, StoryObj  } from '@storybook/nextjs'
import { useState } from 'react'
import { ThemeDialog } from '../../../src/components/dialog'
import { SolidButton } from '../../../src/components/user-action/Button'

/**
 * An implementation of the ThemeDialog
 */
const ThemeDialogExample = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ThemeDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className="flex-row-2 items-center justify-center min-h-[400px]">
        <SolidButton onClick={() => setIsOpen(true)}>Show Dialog</SolidButton>
      </div>
    </>
  )
}

const meta: Meta = {
  title: 'Util/Dialog',
  component: ThemeDialogExample,
}

export default meta
type Story = StoryObj<typeof meta>;

export const themeDialog: Story = {
  render: () => <ThemeDialogExample/>,
  args: {}
}
