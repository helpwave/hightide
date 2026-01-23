import type { Meta, StoryObj } from '@storybook/nextjs'
import { Dialog } from '@/src/components/layout/dialog/Dialog'
import { Button } from '@/src/components/user-interaction/Button'
import type { DialogPosition } from '@/src/components/layout/dialog/Dialog'
import { DialogRoot } from '@/src/components/layout/dialog/DialogRoot'
import { DialogOpenerWrapper } from '@/src/components/layout/dialog/DialogOpener'
import { DialogContext } from '@/src/components/layout/dialog/DialogContext'

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
    return (
      <>
        <DialogRoot>
          <DialogOpenerWrapper>
            {({ props }) => (
              <Button {...props}>Open Dialog 1</Button>
            )}
          </DialogOpenerWrapper>
          <Dialog
            titleElement="Dialog 1"
            description="This is the first Dialog"
            className="w-96 h-128"
            position={position}
          >
            <DialogRoot>
              <DialogOpenerWrapper>
                {({ props }) => (
                  <Button {...props}>Open Dialog 2</Button>
                )}
              </DialogOpenerWrapper>
              <Dialog
                titleElement="Dialog 2"
                description="This is the second Dialog"
                className="w-96 h-128"
                position={position}
              >
                <DialogRoot>
                  <DialogOpenerWrapper>
                    {({ props }) => (
                      <Button {...props}>Open Dialog 3</Button>
                    )}
                  </DialogOpenerWrapper>
                  <Dialog
                    titleElement="Dialog 3"
                    description="This is the third Dialog"
                    className="w-96 h-128"
                    position={position}
                  >
                    <DialogContext.Consumer>
                      {({ setIsOpen }) => (
                        <Button color="negative" onClick={() => setIsOpen(false)}>Close</Button>
                      )}
                    </DialogContext.Consumer>
                  </Dialog>
                </DialogRoot>
                <DialogContext.Consumer>
                  {({ setIsOpen }) => (
                    <Button color="negative" onClick={() => setIsOpen(false)}>Close Dialog 2</Button>
                  )}
                </DialogContext.Consumer>
              </Dialog>
            </DialogRoot>
            <DialogContext.Consumer>
              {({ setIsOpen }) => (
                <Button color="negative" onClick={() => setIsOpen(false)}>Close</Button>
              )}
            </DialogContext.Consumer>
          </Dialog>
        </DialogRoot>
      </>
    )
  }
}
