import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChatDateDivider } from '@/src/components/chat/ChatDateDivider'

const meta: Meta<typeof ChatDateDivider> = {
  component: ChatDateDivider,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatDateDivider: Story = {
  args: {
    children: 'Heute · 09:10',
  },
  render: (args) => (
    <div className="flex-col-3 w-96 p-4 rounded-lg bg-background">
      <ChatDateDivider {...args}/>
    </div>
  ),
}
