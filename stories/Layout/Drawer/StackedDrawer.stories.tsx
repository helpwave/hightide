import type { Meta, StoryObj } from '@storybook/nextjs'
import type { DrawerAligment } from '../../../src/components/layout/Drawer'
import { Drawer } from '../../../src/components/layout/Drawer'
import { useState } from 'react'
import { Button } from '../../../src/components/user-interaction/Button'

type StoryArgs = {
  alignment: DrawerAligment,
}

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>;

export const stackedDrawer: Story = {
  args: {
    alignment: 'left',
  },
  render: ({ alignment }) => {
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [open3, setOpen3] = useState(false)
    return (
      <>
        <div className="flex-row-2 items-center justify-center min-h-[400px]">
          <Button onClick={() => setOpen1(true)}>{'Open Drawer'}</Button>
        </div>

        <Drawer
          titleElement="Drawer 1"
          description="This is the first Drawer"
          isOpen={open1}
          alignment={alignment}
          onClose={() => setOpen1(false)}
        >
          <Button onClick={() => setOpen2(true)}>Open 2</Button>
          <Button color="negative" onClick={() => setOpen1(false)}>Close</Button>
        </Drawer>

        <Drawer
          titleElement="Drawer 2"
          description="This is the second Drawer"
          isOpen={open2}
          alignment={alignment}
          onClose={() => setOpen2(false)}
        >
          <Button onClick={() => setOpen3(true)}>Open 3</Button>
          <Button color="negative" onClick={() => setOpen2(false)}>Close</Button>
        </Drawer>
        <Drawer
          titleElement="Drawer 3"
          description="This is the third Drawer. Click below to close it."
          isOpen={open3}
          alignment={alignment}
          onClose={() => setOpen3(false)}
        >
          <Button color="negative" onClick={() => setOpen3(false)}>Close 3</Button>
        </Drawer>
      </>
    )
  }
}
