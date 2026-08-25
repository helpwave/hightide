import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'

import { ChatMessageComposer } from '@helpwave/hightide-native/components'

const meta = {
  component: ChatMessageComposer,
} satisfies Meta<typeof ChatMessageComposer>

export default meta
type Story = StoryObj<typeof meta>

export const chatMessageComposer: Story = {
  args: {
    placeholder: 'Nachricht …',
    onSend: action('send'),
  },
  render: (args) => (
    <ChatMessageComposer {...args} />
  ),
}
