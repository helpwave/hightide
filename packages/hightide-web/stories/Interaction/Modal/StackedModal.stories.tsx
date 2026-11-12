import type { Meta, StoryObj } from '@storybook/react-vite'
import { Modal } from '../../../src/components/layout/Modal/Modal'
import type { ModalPosition } from '../../../src/components/layout/Modal/Modal'
import { Button } from '../../../src/components/interaction/Button'

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
      <Modal
        titleElement="Modal 1"
        description="This is the first Modal"
        position={position}
        trigger={({ props }) => (
          <Button {...props}>Open Modal 1</Button>
        )}
      >
        <Modal
          titleElement="Modal 2"
          description="This is the second Modal"
          position={position}
          trigger={({ props }) => (
            <Button {...props}>Open Modal 2</Button>
          )}
        >
          <Modal
            titleElement="Modal 3"
            description="This is the third Modal"
            position={position}
            trigger={({ props }) => (
              <Button {...props}>Open Modal 3</Button>
            )}
          >
            <Modal.Consumer>
              {({ dispatch }) => (
                <Button color="negative" onClick={() => dispatch({ type: 'close' })}>Close</Button>
              )}
            </Modal.Consumer>
          </Modal>
          <Modal.Consumer>
            {({ dispatch }) => (
              <Button color="negative" onClick={() => dispatch({ type: 'close' })}>Close Modal 2</Button>
            )}
          </Modal.Consumer>
        </Modal>
        <Modal.Consumer>
          {({ dispatch }) => (
            <Button color="negative" onClick={() => dispatch({ type: 'close' })}>Close</Button>
          )}
        </Modal.Consumer>
      </Modal>
    )
  }
}
