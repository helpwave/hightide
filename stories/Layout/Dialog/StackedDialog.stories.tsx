import type { Meta, StoryObj } from '@storybook/nextjs'
import type { DialogPosition } from '@/src/components/layout/dialog/Dialog'
import { Dialog } from '@/src/components/layout/dialog/Dialog'
import { Button } from '@/src/components/user-interaction/Button'
import { useVisbilityCoordinator } from '@/src/hooks/useVisibilityCoordinator'

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
    const dialog1 = useVisbilityCoordinator({
      id: 'dialog1',
      registerMode: 'both',
      trigger: { isActiveTrigger: true },
    })
    const dialog2 = useVisbilityCoordinator({
      id: 'dialog2',
      registerMode: 'both',
      trigger: { isActiveTrigger: true },
    })
    const dialog3 = useVisbilityCoordinator({
      id: 'dialog3',
      registerMode: 'both',
      trigger: { isActiveTrigger: true },
    })
    return (
      <>
        <div className="flex-row-2 items-center justify-center min-h-[400px]">
          <Button onClick={dialog1.trigger?.toggle}>Open Dialog</Button>
        </div>

        <Dialog
          titleElement="Dialog 1"
          description="This is the first Dialog"
          isOpen={dialog1.isVisible}
          className="w-96 h-128"
          position={position}
          onClose={dialog1.target?.close}
        >
          <Button onClick={dialog2.trigger?.toggle}>Open 2</Button>
          <Button color="negative" onClick={dialog1.target?.close}>Close</Button>
        </Dialog>

        <Dialog
          titleElement="Dialog 2"
          description="This is the second Dialog"
          isOpen={dialog2.isVisible}
          className="w-[400px] bg-positive text-on-positive"
          position={position}
          onClose={dialog2.target?.close}
        >
          <Button onClick={dialog3.trigger?.toggle}>Open 3</Button>
          <Button color="negative" onClick={dialog2.target?.close}>Close</Button>
        </Dialog>
        <Dialog
          titleElement="Dialog 3"
          description="This is the third Dialog. Click below to close it."
          isOpen={dialog3.isVisible}
          position={position}
          onClose={dialog3.target?.close}
        >
          <Button color="negative" onClick={dialog3.target?.close}>Close 3</Button>
        </Dialog>
      </>
    )
  }
}
