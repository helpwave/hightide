import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import type { DialogPosition } from '@/src/components/layout/dialog/Dialog'
import { Dialog } from '@/src/components/layout/dialog/Dialog'
import { Button } from '@/src/components/user-interaction/Button'

type StoryArgs = {
  position: DialogPosition,
}

const meta: Meta<StoryArgs> = {
}

export default meta
type Story = StoryObj<typeof meta>;

export const stackedDialog: Story = {
  args: {
    position: 'center'
  },
  render: ({ position }) => {
    const [modal1, setModal1] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    return (
      <>
        <div className="flex-row-2 items-center justify-center min-h-[400px]">
          <Button onClick={() => setModal1(true)}>Open Dialog</Button>
        </div>

        <Dialog
          titleElement="Dialog 1"
          description="This is the first Dialog"
          isOpen={modal1}
          className="w-96 h-128"
          position={position}
          onClose={() => setModal1(false)}
        >
          <Button onClick={() => setModal2(true)}>Open 2</Button>
          <Button color="negative" onClick={() => setModal1(false)}>Close</Button>
        </Dialog>

        <Dialog
          titleElement="Dialog 2"
          description="This is the second Dialog"
          isOpen={modal2}
          className="w-[400px] bg-positive text-on-positive"
          position={position}
          onClose={() => setModal2(false)}
        >
          <Button onClick={() => setModal3(true)}>Open 3</Button>
          <Button color="negative" onClick={() => setModal2(false)}>Close</Button>
        </Dialog>
        <Dialog
          titleElement="Dialog 3"
          description="This is the third Dialog. Click below to close it."
          isOpen={modal3}
          position={position}
          onClose={() => setModal3(false)}
        >
          <Button color="negative" onClick={() => setModal3(false)}>Close 3</Button>
        </Dialog>
      </>
    )
  }
}
