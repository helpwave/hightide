import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { Camera, Paperclip } from 'lucide-react'
import { ChatComposer } from '@/src/components/chat/ChatComposer'
import { IconButton } from '@/src/components/user-interaction/IconButton'

const meta: Meta<typeof ChatComposer> = {
  component: ChatComposer,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatComposer: Story = {
  args: {
    placeholder: 'Nachricht an Dr. med. Sophie Vogt schreiben',
    sendLabel: 'Senden',
    disabled: false,
    onSend: action('onSend'),
  },
  render: (args) => (
    <div className="w-150 max-w-full">
      <ChatComposer
        {...args}
        leading={(
          <>
            <IconButton tooltip="Kamera" size="sm" color="neutral" coloringStyle="text">
              <Camera/>
            </IconButton>
            <IconButton tooltip="Anhang" size="sm" color="neutral" coloringStyle="text">
              <Paperclip/>
            </IconButton>
          </>
        )}
      />
    </div>
  ),
}
