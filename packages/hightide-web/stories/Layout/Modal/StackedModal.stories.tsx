import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Modal } from '../../../src/components/layout/Modal/Modal'
import type { ModalPosition } from '../../../src/components/layout/Modal/Modal'
import { Button } from '../../../src/components/user-interaction/Button'

type StoryArgs = {
  position: ModalPosition,
}

const meta: Meta<StoryArgs> = {
}

export default meta
type Story = StoryObj<typeof meta>;

export const stackedModal: Story = {
  args: {
    position: 'center'
  },
  render: ({ position }) => {
    return (
      <>
        <Modal.Root>
          <Modal.Opener>
            {({ props }) => (
              <Button {...props}>Open Modal 1</Button>
            )}
          </Modal.Opener>
          <Modal
            titleElement="Modal 1"
            description="This is the first Modal"
            position={position}
          >
            <Modal.Root>
              <Modal.Opener>
                {({ props }) => (
                  <Button {...props}>Open Modal 2</Button>
                )}
              </Modal.Opener>
              <Modal
                titleElement="Modal 2"
                description="This is the second Modal"
                position={position}
              >
                <Modal.Root>
                  <Modal.Opener>
                    {({ props }) => (
                      <Button {...props}>Open Modal 3</Button>
                    )}
                  </Modal.Opener>
                  <Modal
                    titleElement="Modal 3"
                    description="This is the third Modal"
                    position={position}
                  >
                    <Modal.Consumer>
                      {({ setIsOpen }) => (
                        <Button color="negative" onClick={() => setIsOpen(false)}>Close</Button>
                      )}
                    </Modal.Consumer>
                  </Modal>
                </Modal.Root>
                <Modal.Consumer>
                  {({ setIsOpen }) => (
                    <Button color="negative" onClick={() => setIsOpen(false)}>Close Modal 2</Button>
                  )}
                </Modal.Consumer>
              </Modal>
            </Modal.Root>
            <Modal.Consumer>
              {({ setIsOpen }) => (
                <Button color="negative" onClick={() => setIsOpen(false)}>Close</Button>
              )}
            </Modal.Consumer>
          </Modal>
        </Modal.Root>
      </>
    )
  }
}
