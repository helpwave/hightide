import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CalendarDays } from 'lucide-react'
import { ChatMessageList } from '../../src/components/chat/ChatMessageList'
import { ChatMessageBubble } from '../../src/components/chat/ChatMessageBubble'
import { ChatMessageCard } from '../../src/components/chat/ChatMessageCard'
import { ChatAttachmentCard } from '../../src/components/chat/ChatAttachmentCard'
import { ChatDateDivider } from '../../src/components/chat/ChatDateDivider'
import { ChatSystemLine } from '../../src/components/chat/ChatSystemLine'
import { Chip } from '../../src/components/display-and-visualization/Chip'
import { Button } from '../../src/components/user-interaction/Button'

const meta: Meta<typeof ChatMessageList> = {
  component: ChatMessageList,
}

export default meta
type Story = StoryObj<typeof meta>

export const chatMessageList: Story = {
  args: {
    autoScroll: true,
  },
  render: (args) => (
    <div className="h-150 w-120 max-w-full overflow-hidden">
      <ChatMessageList {...args}>
        <ChatDateDivider>Heute · 09:10</ChatDateDivider>
        <ChatMessageBubble direction="incoming" timestamp="09:12">
          Guten Tag Herr Wellermann, wir haben die Ergebnisse Ihrer Blutuntersuchung erhalten und würden die Werte gerne mit Ihnen besprechen.
        </ChatMessageBubble>
        <ChatMessageCard
          icon={<CalendarDays/>}
          title="Terminvorschlag"
          subtitle="Besprechung Blutwerte · 30 Min"
          direction="incoming"
          badge={<Chip size="xs" color="warning" coloringStyle="tonal">AUSSTEHEND</Chip>}
          actions={(
            <>
              <Button size="sm" color="primary" className="rounded-full">Zusagen</Button>
              <Button size="sm" color="neutral" className="rounded-full">Ablehnen</Button>
            </>
          )}
        >
          <span className="typography-title-md">Mi. 8. Juli 2026</span>
          <span className="text-sm text-description">15:00 – 15:30 Uhr · Sprechzimmer 2</span>
        </ChatMessageCard>
        <ChatMessageBubble direction="outgoing" timestamp="09:20">
          Vielen Dank. 15:00 Uhr passt mir gut – ich komme vorbei.
        </ChatMessageBubble>
        <ChatSystemLine>Termin bestätigt · Mi. 8. Juli, 15:00 Uhr</ChatSystemLine>
        <ChatAttachmentCard
          name="Befund_Blutbild.pdf"
          metadata="PDF · 196 KB · 09:21"
          direction="incoming"
          downloadLabel="Herunterladen"
          onDownload={() => {}}
        />
        <ChatMessageBubble direction="outgoing" timestamp="09:24" readReceipt="Gelesen">
          Perfekt, ich habe den Befund erhalten. Bis Mittwoch!
        </ChatMessageBubble>
      </ChatMessageList>
    </div>
  ),
}
