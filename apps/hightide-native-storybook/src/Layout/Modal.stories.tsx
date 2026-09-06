import { useState } from 'react'
import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'

import {
  Button,
  Modal,
  ThemedText
} from '@helpwave/hightide-native/components'

const meta = {
  component: Modal,
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

const ModalDemo = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <View>
      <Button
        onPress={() => setIsOpen(true)}
      >
        Open modal
      </Button>
      <Modal
        isOpen={isOpen}
        onIsOpenChange={(open) => {
          setIsOpen(open)
          action('onIsOpenChange')(open)
        }}
      >
        <View style={{ padding: 24, paddingTop: 48 }}>
          <ThemedText>Dialog content</ThemedText>
        </View>
      </Modal>
    </View>
  )
}

const ModalComposedDemo = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Modal.Root
      isOpen={isOpen}
      onIsOpenChange={(open) => {
        setIsOpen(open)
        action('onIsOpenChange')(open)
      }}
    >
      <Button
        onPress={() => setIsOpen(true)}
      >
        Open modal
      </Button>
      <Modal.Background>
        <Modal.Menu>
          <Modal.CloseButton />
          <View style={{ padding: 24, paddingTop: 48 }}>
            <ThemedText>Dialog content</ThemedText>
          </View>
        </Modal.Menu>
      </Modal.Background>
    </Modal.Root>
  )
}

export const modal: Story = {
  render: () => <ModalDemo />,
}

export const modalComposed: Story = {
  render: () => <ModalComposedDemo />,
}
