import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { Modal, SolidButton } from '../../../src'


/**
 * An Example Component for Stacking Modals
 */
const StackingModals = () => {
  const [modal1, setModal1] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [modal3, setModal3] = useState(false)

  return (
    <>
      <Modal
        isOpen={modal1}
        onClose={() => setModal1(false)}
        headerProps={{ titleText: 'Modal 1' }}
        className="min-h-[300px]"
      >
        {'I\'m Modal 1'}
        <SolidButton onClick={() => setModal2(true)}>Open Modal 2</SolidButton>
      </Modal>
      <Modal
        isOpen={modal2}
        onClose={() => setModal2(false)}
        headerProps={{ titleText: 'Modal 2' }}
        className="min-w-[300px] !bg-green-200 !text-black"
      >
        {'The next layer of Modals!'}
        {'This is Modal 2'}
        <SolidButton onClick={() => setModal3(true)}>Open Modal 3</SolidButton>
      </Modal>
      <Modal
        isOpen={modal3}
        onClose={() => setModal3(false)}
        headerProps={{ titleText: 'Modal 3' }}
        className="!bg-yellow-200 !text-black"
      >
        {'This is Modal 3!'}
      </Modal>
      <div className="flex-row-2 items-center justify-center min-h-[400px]">
        <SolidButton onClick={() => setModal1(true)}>Open Modal 1</SolidButton>
      </div>
    </>
  )
}

const meta: Meta = {
  title: 'Layout/Modal',
  component: StackingModals,
}

export default meta
type Story = StoryObj<typeof meta>;

export const modal: Story = {
  render: () => <StackingModals/>,
  args: {}
}
