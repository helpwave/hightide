import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { SolidButton } from '../../src'
import { Dialog } from '../../src'


/**
 * An Example Component for Stacking Modals
 */
const StackedDialog = () => {
  const [modal1, setModal1] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [modal3, setModal3] = useState(false)
  return (
    <>
      <SolidButton onClick={() => setModal1(true)}>Open Modal</SolidButton>

      <Dialog titleText="Dialog 1" isOpen={modal1} className="w-[300px]">
        <SolidButton onClick={() => setModal2(true)}>Open 2</SolidButton>
        <SolidButton color="negative" onClick={() => setModal1(false)}>Close</SolidButton>
      </Dialog>

      <Dialog titleText="Dialog 2" isOpen={modal2} className="w-[400px] bg-green-300 text-black">
        <SolidButton onClick={() => setModal3(true)}>Open 3</SolidButton>
        <SolidButton color="negative" onClick={() => setModal2(false)}>Close</SolidButton>
      </Dialog>

      <Dialog titleText="Dialog 3" isOpen={modal3}>
        <SolidButton color="negative" onClick={() => setModal3(false)}>Close 3</SolidButton>
      </Dialog>
    </>
  )
}

const meta: Meta = {
  title: 'Layout/Dialog',
  component: StackedDialog,
}

export default meta
type Story = StoryObj<typeof meta>;

export const stackingDialogs: Story = {
  render: () => <StackedDialog/>,
  args: {}
}
