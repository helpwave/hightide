import type { Meta, StoryObj  } from '@storybook/nextjs'
import { useState } from 'react'
import { ThemeDialog } from '../../../src/components/dialog/ThemeDialog'
import { Button } from '../../../src/components/user-action/Button'

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
        <Button onClick={() => setIsOpen(true)}>Show Dialog</Button>
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
