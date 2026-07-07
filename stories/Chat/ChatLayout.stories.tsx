import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { CalendarDays, Pill } from 'lucide-react'
import { action } from 'storybook/actions'
import type { AvatarStatus } from '@/src/components/display-and-visualization/Avatar'
import type { ChatLayoutListPosition } from '@/src/components/chat/ChatLayout'
import { ChatLayout, ChatThread } from '@/src/components/chat/ChatLayout'
import { ChatConversationList } from '@/src/components/chat/ChatConversationList'
import { ChatConversationRow } from '@/src/components/chat/ChatConversationRow'
import { ChatThreadHeader } from '@/src/components/chat/ChatThreadHeader'
import { ChatMessageList } from '@/src/components/chat/ChatMessageList'
import { ChatMessageBubble } from '@/src/components/chat/ChatMessageBubble'
import { ChatMessageCard } from '@/src/components/chat/ChatMessageCard'
import { ChatAttachmentCard } from '@/src/components/chat/ChatAttachmentCard'
import { ChatDateDivider } from '@/src/components/chat/ChatDateDivider'
import { ChatSystemLine } from '@/src/components/chat/ChatSystemLine'
import { ChatQuickReplyChip } from '@/src/components/chat/ChatQuickReplyChip'
import { ChatComposer } from '@/src/components/chat/ChatComposer'
import { Chip } from '@/src/components/display-and-visualization/Chip'
import { Button } from '@/src/components/user-interaction/Button'
import { TimeDisplay } from '@/src/components/user-interaction/date/TimeDisplay'

type DemoMessage = {
  id: string,
  direction: 'incoming' | 'outgoing',
  content: string,
  timestamp: ReactNode,
  readReceipt?: string,
}

type DemoConversation = {
  id: string,
  name: string,
  status: AvatarStatus,
  meta: string,
  timestamp: ReactNode,
  preview: string,
  unreadCount?: number,
  isUnread?: boolean,
  hasSentIndicator?: boolean,
}

const conversations: DemoConversation[] = [
  {
    id: 'wellermann',
    name: 'Jonas Wellermann',
    status: 'online',
    meta: 'geb. 14.03.1982 · Vers.-Nr. K220541880 · GKV',
    timestamp: '14:22',
    preview: 'Perfekt, ich habe den Befund erhalten.',
    unreadCount: 2,
    isUnread: true,
  },
  {
    id: 'otte',
    name: 'Miriam Otte',
    status: 'offline',
    meta: 'geb. 02.11.1974 · Vers.-Nr. M110236775 · GKV',
    timestamp: 'Gestern',
    preview: 'Vielen Dank für die schnelle Rückmeldung.',
    hasSentIndicator: true,
  },
  {
    id: 'hagen',
    name: 'Bernd Hagen',
    status: 'offline',
    meta: 'geb. 29.06.1958 · Vers.-Nr. B290658214 · PKV',
    timestamp: 'Mo.',
    preview: 'Das Rezept ist unterwegs.',
    hasSentIndicator: true,
  },
]

const initialMessages: DemoMessage[] = [
  {
    id: 'm1',
    direction: 'incoming',
    content: 'Guten Tag, ich bräuchte ein Folgerezept für Ramipril 5mg. Die Packung reicht noch bis Ende der Woche.',
    timestamp: '13:58',
  },
  {
    id: 'm2',
    direction: 'outgoing',
    content: 'Guten Tag Herr Wellermann, danke für Ihre Nachricht. Wir schauen uns das direkt an.',
    timestamp: '14:05',
  },
  {
    id: 'm3',
    direction: 'outgoing',
    content: 'Passt Ihnen zusätzlich ein kurzer Termin zur Besprechung Ihrer Blutwerte?',
    timestamp: '14:10',
    readReceipt: 'Gelesen',
  },
]

const meta: Meta<typeof ChatLayout> = {
  component: ChatLayout,
  argTypes: {
    listPosition: {
      control: 'select',
      options: ['left', 'right'] satisfies ChatLayoutListPosition[],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const chatLayout: Story = {
  args: {
    listPosition: 'left',
    className: 'rounded-lg border border-divider',
    conversationList: null,
  },
  decorators: [
    (Story) => (
      <>
        <style>{'#storybook-root > main { padding: 0 !important; }'}</style>
        <div className="h-dvh w-full p-3 bg-background">
          <Story/>
        </div>
      </>
    ),
  ],
  render: (args) => {
    const [selectedId, setSelectedId] = useState<string | null>('wellermann')
    const [messages, setMessages] = useState<DemoMessage[]>(initialMessages)
    const selected = conversations.find(conversation => conversation.id === selectedId)

    const sendMessage = (content: string) => {
      setMessages(previous => [
        ...previous,
        {
          id: `m${previous.length + 1}`,
          direction: 'outgoing',
          content,
          timestamp: <TimeDisplay date={new Date()} mode="time"/>,
        },
      ])
    }

    return (
      <ChatLayout
        {...args}
        isConversationOpen={!!selected}
        conversationList={(
          <ChatConversationList
            title="Chats"
            createLabel="Neuer Chat"
            hasSearch={true}
            searchPlaceholder="Patient oder Nachricht suchen"
            onCreate={action('onCreate')}
            onSearch={action('onSearch')}
          >
            {conversations.map(conversation => (
              <ChatConversationRow
                key={conversation.id}
                avatar={{ name: conversation.name, status: conversation.status }}
                title={conversation.name}
                timestamp={conversation.timestamp}
                preview={conversation.preview}
                unreadCount={conversation.unreadCount}
                isUnread={conversation.isUnread}
                hasSentIndicator={conversation.hasSentIndicator}
                isSelected={conversation.id === selectedId}
                onClick={() => setSelectedId(conversation.id)}
              />
            ))}
          </ChatConversationList>
        )}
      >
        {selected && (
          <ChatThread
            header={(
              <ChatThreadHeader
                avatar={{ name: selected.name, status: selected.status }}
                title={selected.name}
                subtitle={selected.meta}
                backLabel="Zurück"
                callLabel="Anrufen"
                addContactLabel="Zu Kontakten hinzufügen"
                onBack={() => setSelectedId(null)}
                onCall={action('onCall')}
                onAddContact={action('onAddContact')}
              />
            )}
            footer={(
              <>
                <div className="flex-row-2 flex-wrap px-3.5 pt-3 pb-4 bg-surface">
                  <ChatQuickReplyChip isActive={true} onClick={action('onQuickReply')}>Termin bestätigen</ChatQuickReplyChip>
                  <ChatQuickReplyChip onClick={action('onQuickReply')}>Rezept ausstellen</ChatQuickReplyChip>
                  <ChatQuickReplyChip onClick={action('onQuickReply')}>Überweisung senden</ChatQuickReplyChip>
                </div>
                <ChatComposer
                  placeholder={`Nachricht an ${selected.name} schreiben`}
                  sendLabel="Senden"
                  cameraLabel="Kamera"
                  attachmentLabel="Anhang"
                  onSend={sendMessage}
                  onCamera={action('onCamera')}
                  onAttachment={action('onAttachment')}
                />
              </>
            )}
          >
            <ChatMessageList>
              <ChatDateDivider>
                <TimeDisplay date={new Date()} mode="date"/>
              </ChatDateDivider>
              {messages.slice(0, 1).map(message => (
                <ChatMessageBubble key={message.id} direction={message.direction} timestamp={message.timestamp}>
                  {message.content}
                </ChatMessageBubble>
              ))}
              <ChatMessageCard
                icon={<Pill/>}
                title="Rezept-Anfrage"
                subtitle="Folgeverordnung"
                direction="incoming"
                badge={<Chip size="xs" color="primary" coloringStyle="tonal">NEU</Chip>}
                actions={(
                  <>
                    <Button size="sm" color="primary" className="rounded-full" onClick={action('onIssue')}>Ausstellen</Button>
                    <Button size="sm" color="neutral" className="rounded-full" onClick={action('onDecline')}>Ablehnen</Button>
                  </>
                )}
              >
                <span className="typography-title-md">Ramipril 5mg</span>
                <span className="text-sm text-description">N2 · 50 Stück · zuletzt 12.05.2026</span>
              </ChatMessageCard>
              <ChatMessageCard
                icon={<CalendarDays/>}
                title="Terminvorschlag"
                subtitle="Besprechung Blutwerte · 30 Min"
                direction="outgoing"
                badge={<Chip size="xs" color="warning" coloringStyle="tonal">AUSSTEHEND</Chip>}
              >
                <span className="typography-title-md">Mi. 8. Juli 2026</span>
                <span className="text-sm text-description">15:00 – 15:30 Uhr · Sprechzimmer 2</span>
              </ChatMessageCard>
              <ChatSystemLine>Termin bestätigt · Mi. 8. Juli, 15:00 Uhr</ChatSystemLine>
              <ChatAttachmentCard
                name="Befund_Blutbild.pdf"
                metadata="PDF · 196 KB · 14:18"
                direction="incoming"
                downloadLabel="Herunterladen"
                onDownload={action('onDownload')}
              />
              {messages.slice(1).map(message => (
                <ChatMessageBubble
                  key={message.id}
                  direction={message.direction}
                  timestamp={message.timestamp}
                  readReceipt={message.readReceipt}
                >
                  {message.content}
                </ChatMessageBubble>
              ))}
            </ChatMessageList>
          </ChatThread>
        )}
      </ChatLayout>
    )
  },
}
