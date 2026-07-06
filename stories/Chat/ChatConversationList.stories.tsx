import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { SquarePen } from 'lucide-react'
import { ChatConversationList } from '@/src/components/chat/ChatConversationList'
import { ChatConversationRow } from '@/src/components/chat/ChatConversationRow'
import { SearchBar } from '@/src/components/user-interaction/input/SearchBar'
import { IconButton } from '@/src/components/user-interaction/IconButton'

const meta: Meta<typeof ChatConversationList> = {
  component: ChatConversationList,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatConversationList: Story = {
  args: {},
  render: (args) => (
    <div className="h-120 w-90 rounded-lg border border-divider overflow-hidden">
      <ChatConversationList
        {...args}
        header={(
          <>
            <div className="flex-row-2 items-center justify-between">
              <span className="typography-title-md text-primary">Chats</span>
              <IconButton tooltip="Neuer Chat" size="sm" color="neutral" coloringStyle="text">
                <SquarePen/>
              </IconButton>
            </div>
            <SearchBar placeholder="Patient oder Nachricht suchen" onSearch={action('onSearch')}/>
          </>
        )}
      >
        <ChatConversationRow
          avatar={{ name: 'Jonas Wellermann', status: 'online' }}
          title="Jonas Wellermann"
          timestamp="14:22"
          preview="Perfekt, ich habe den Befund erhalten."
          unreadCount={2}
          isUnread={true}
          onClick={action('onClick')}
        />
        <ChatConversationRow
          avatar={{ name: 'Miriam Otte', status: 'offline' }}
          title="Miriam Otte"
          timestamp="Gestern"
          preview="Vielen Dank für die schnelle Rückmeldung."
          hasSentIndicator={true}
          isSelected={true}
          onClick={action('onClick')}
        />
        <ChatConversationRow
          avatar={{ name: 'Bernd Hagen', status: 'offline' }}
          title="Bernd Hagen"
          timestamp="Mo."
          preview="Das Rezept ist unterwegs."
          onClick={action('onClick')}
        />
      </ChatConversationList>
    </div>
  ),
}
