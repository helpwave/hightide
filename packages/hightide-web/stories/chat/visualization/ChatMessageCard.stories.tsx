import type { ElementType, ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CalendarDays, Pill, Send } from 'lucide-react'
import { ChatMessageBubble, type ChatMessageBubbleProps } from '../../../src/components/chat/visualization/ChatMessageBubble'
import { Chip } from '../../../src/components/visualization/Chip'
import { Icon } from '../../../src/components/visualization/Icon'
import { Button } from '../../../src/components/interaction/Button'
import { ColoringUtils, type ColoringColor } from '../../../src/utils/coloring'
import clsx from 'clsx'

const meta = {
  component: ChatMessageBubble,
} satisfies Meta<typeof ChatMessageBubble>

export default meta
type Story = StoryObj<typeof meta>

type MessageCardStoryProps = ChatMessageBubbleProps & {
  icon: ElementType,
  title: string,
  subtitle?: string,
  badge?: ReactNode,
  body?: ReactNode,
  actions?: ReactNode,
  color?: ColoringColor,
}

const MessageCardStory = ({
  icon,
  title,
  subtitle,
  badge,
  body,
  actions,
  color = 'primary',
  ...bubbleProps
}: MessageCardStoryProps) => (
  <ChatMessageBubble {...bubbleProps} className={clsx(bubbleProps?.className, 'max-w-96')}>
    <div className="flex-col-0 w-full min-w-64">
      <div className="flex-row-0 gap-x-2.5 items-center pb-3 border-b border-divider">
        <span
          className="flex-row-0 items-center justify-center size-9 shrink-0 rounded-md"
          {...ColoringUtils.build({ color, colorVariant: 'tonal' })}
        >
          <Icon icon={icon} size="sm" />
        </span>
        <span className="flex-col-0 gap-y-0.5 grow min-w-0">
          <span className="text-sm font-space font-bold">{title}</span>
          {subtitle && (
            <span className="text-xs text-description">{subtitle}</span>
          )}
        </span>
        {badge && (
          <span className="shrink-0">{badge}</span>
        )}
      </div>
      {body && (
        <div className="flex-col-1 py-3">{body}</div>
      )}
      {actions && (
        <div className="flex-row-0 gap-x-2.5 pb-1 [&>*]:flex-1 [&>.button]:min-w-0">
          {actions}
        </div>
      )}
    </div>
  </ChatMessageBubble>
)

export const appointmentProposal: Story = {
  args: {
    direction: 'incoming',
    timestamp: new Date(2026, 6, 8, 15, 0),
  },
  render: (args) => (
    <MessageCardStory
      {...args}
      icon={CalendarDays}
      title="Terminvorschlag"
      subtitle="Besprechung Blutwerte · 30 Min"
      badge={<Chip size="xs" color="warning" colorVariant="tonal">AUSSTEHEND</Chip>}
      body={(
        <>
          <span className="typography-title-md">Mi. 8. Juli 2026</span>
          <span className="text-sm text-description">15:00 – 15:30 Uhr · Sprechzimmer 2</span>
        </>
      )}
      actions={(
        <>
          <Button size="sm" color="primary" className="rounded-full">Zusagen</Button>
          <Button size="sm" color="neutral" className="rounded-full">Ablehnen</Button>
        </>
      )}
    />
  ),
}

export const prescriptionRequest: Story = {
  args: {
    direction: 'incoming',
    timestamp: new Date(2026, 6, 8, 14, 12),
  },
  render: (args) => (
    <MessageCardStory
      {...args}
      icon={Pill}
      title="Rezept-Anfrage"
      subtitle="Folgeverordnung"
      badge={<Chip size="xs" color="primary" colorVariant="tonal">NEU</Chip>}
      body={(
        <>
          <span className="typography-title-md">Ramipril 5mg</span>
          <span className="text-sm text-description">N2 · 50 Stück · zuletzt 12.05.2026</span>
        </>
      )}
      actions={(
        <>
          <Button size="sm" color="primary" className="rounded-full">Ausstellen</Button>
          <Button size="sm" color="neutral" className="rounded-full">Ablehnen</Button>
        </>
      )}
    />
  ),
}

export const referral: Story = {
  args: {
    direction: 'outgoing',
    timestamp: new Date(2026, 6, 8, 16, 40),
    status: 'sent',
  },
  render: (args) => (
    <MessageCardStory
      {...args}
      icon={Send}
      title="Überweisung"
      subtitle="Kardiologie"
      color="secondary"
      badge={<Chip size="xs" color="secondary" colorVariant="tonal">GESENDET</Chip>}
      body={(
        <>
          <span className="typography-title-md">Dr. med. K. Brandt</span>
          <span className="text-sm text-description">Kardiologische Praxis am Markt</span>
        </>
      )}
    />
  ),
}
