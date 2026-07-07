import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { ChatComposer } from '@/src/components/chat/ChatComposer'

const meta: Meta<typeof ChatComposer> = {
  component: ChatComposer,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatComposer: Story = {
  args: {
    placeholder: 'Nachricht an Dr. med. Sophie Vogt schreiben',
    sendLabel: 'Senden',
    cameraLabel: 'Kamera',
    attachmentLabel: 'Anhang',
    disabled: false,
    onSend: action('onSend'),
    onCamera: action('onCamera'),
    onAttachment: action('onAttachment'),
  },
  render: (args) => (
    <div className="w-150 max-w-full">
      <ChatComposer {...args}/>
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
      <ChatComposer {...args}/>
    </div>
  ),
}
