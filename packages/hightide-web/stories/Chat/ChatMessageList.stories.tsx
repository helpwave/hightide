import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CalendarDays } from 'lucide-react'
import { ChatMessageList } from '../../src/components/chat/ChatMessageList'
import { ChatMessageBubble } from '../../src/components/chat/ChatMessageBubble'
import { ChatAttachmentMessageBubble } from '../../src/components/chat/ChatAttachmentMessageBubble'
import { ChatDateDivider } from '../../src/components/chat/ChatDateDivider'
import { ChatSystemLine } from '../../src/components/chat/ChatSystemLine'
import { Chip } from '../../src/components/display-and-visualization/Chip'
import { Icon } from '../../src/components/display-and-visualization/Icon'
import { Button } from '../../src/components/user-interaction/Button'
import { ColoringUtils } from '../../src/utils/coloring'

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
        <ChatMessageBubble direction="incoming" timestamp={new Date(2026, 6, 8, 9, 12)}>
          Guten Tag Herr Wellermann, wir haben die Ergebnisse Ihrer Blutuntersuchung erhalten und würden die Werte gerne mit Ihnen besprechen.
        </ChatMessageBubble>
        <ChatMessageBubble direction="incoming" timestamp={new Date(2026, 6, 8, 9, 13)}>
          <div className="flex-col-0 w-full min-w-56">
            <div className="flex-row-0 gap-x-2.5 items-center pb-3 border-b border-divider">
              <span
                className="flex-row-0 items-center justify-center size-9 shrink-0 rounded-md"
                {...ColoringUtils.build({ color: 'primary', colorVariant: 'tonal' })}
              >
                <Icon icon={CalendarDays} size="sm" />
              </span>
              <span className="flex-col-0 gap-y-0.5 grow min-w-0">
                <span className="text-sm font-space font-bold">Terminvorschlag</span>
                <span className="text-xs text-description">Besprechung Blutwerte · 30 Min</span>
              </span>
              <Chip size="xs" color="warning" coloringStyle="tonal">AUSSTEHEND</Chip>
            </div>
            <div className="flex-col-1 py-3">
              <span className="typography-title-md">Mi. 8. Juli 2026</span>
              <span className="text-sm text-description">15:00 – 15:30 Uhr · Sprechzimmer 2</span>
            </div>
            <div className="flex-row-0 gap-x-2.5 [&>*]:flex-1 [&>.button]:min-w-0">
              <Button size="sm" color="primary" className="rounded-full">Zusagen</Button>
              <Button size="sm" color="neutral" className="rounded-full">Ablehnen</Button>
            </div>
          </div>
        </ChatMessageBubble>
        <ChatMessageBubble direction="outgoing" timestamp={new Date(2026, 6, 8, 9, 20)} status="sent">
          Vielen Dank. 15:00 Uhr passt mir gut – ich komme vorbei.
        </ChatMessageBubble>
        <ChatSystemLine>Termin bestätigt · Mi. 8. Juli, 15:00 Uhr</ChatSystemLine>
        <ChatAttachmentMessageBubble
          name="Befund_Blutbild.pdf"
          metadata="PDF · 196 KB"
          direction="incoming"
          timestamp={new Date(2026, 6, 8, 9, 21)}
          downloadLabel="Herunterladen"
          onDownload={() => {}}
        />
        <ChatMessageBubble direction="outgoing" timestamp={new Date(2026, 6, 8, 9, 24)} status="read">
          Perfekt, ich habe den Befund erhalten. Bis Mittwoch!
        </ChatMessageBubble>
      </ChatMessageList>
    </div>
  ),
}
