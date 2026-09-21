import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { Camera, Paperclip } from 'lucide-react'
import { ChatMessageComposer } from '../../src/components/chat/ChatMessageComposer'
import { IconButton } from '../../src/components/user-interaction/IconButton'

const meta: Meta<typeof ChatMessageComposer> = {
  component: ChatMessageComposer,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatMessageComposer: Story = {
  args: {
    placeholder: 'Nachricht an Dr. med. Sophie Vogt schreiben',
    sendLabel: 'Senden',
    disabled: false,
    onSend: action('onSend'),
    actions: (
      <>
        <IconButton
          tooltip="Kamera"
          color="neutral"
          coloringStyle="text"
          onClick={action('onCamera')}
        >
          <Camera/>
        </IconButton>
        <IconButton
          tooltip="Anhang"
          color="neutral"
          coloringStyle="text"
          onClick={action('onAttachment')}
        >
          <Paperclip/>
        </IconButton>
      </>
    ),
  },
  render: (args) => (
    <div className="w-150 max-w-full">
      <ChatMessageComposer {...args}/>
    </div>
  ),
}

export const withoutActions: Story = {
  args: {
    placeholder: 'Nachricht schreiben',
    sendLabel: 'Senden',
    onSend: action('onSend'),
  },
  render: (args) => (
    <div className="w-150 max-w-full">
      <ChatMessageComposer {...args}/>
    </div>
  ),
}
