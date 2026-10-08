import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatSystemLine } from '../../../src/components/chat/visualization/ChatSystemLine'

const meta: Meta<typeof ChatSystemLine> = {
  component: ChatSystemLine,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatSystemLine: Story = {
  args: {
    color: 'primary',
    children: 'Termin bestätigt · Mi. 8. Juli, 15:00 Uhr',
  },
}
