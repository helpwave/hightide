import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChatDateDivider } from '@/src/components/chat/ChatDateDivider'
import { TimeDisplay } from '@/src/components/user-interaction/date/TimeDisplay'

const meta: Meta<typeof ChatDateDivider> = {
  component: ChatDateDivider,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatDateDivider: Story = {
  args: {},
  render: (args) => (
    <div className="flex-col-3 w-96 p-4 rounded-lg bg-background">
      <ChatDateDivider {...args}>
        <TimeDisplay date={new Date()} mode="daysFromToday"/>
      </ChatDateDivider>
      <ChatDateDivider {...args}>Heute · 09:10</ChatDateDivider>
    </div>
  ),
}
