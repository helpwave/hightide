import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CalendarDays, Pill, Send } from 'lucide-react'
import { ChatMessageCard } from '@/src/components/chat/ChatMessageCard'
import { Chip } from '@/src/components/display-and-visualization/Chip'
import { Button } from '@/src/components/user-interaction/Button'

const meta: Meta<typeof ChatMessageCard> = {
  component: ChatMessageCard,
}

export default meta
type Story = StoryObj<typeof meta>

export const appointmentProposal: Story = {
  args: {
    icon: <CalendarDays/>,
    title: 'Terminvorschlag',
    subtitle: 'Besprechung Blutwerte · 30 Min',
    color: 'primary',
    direction: 'incoming',
    badge: (
      <Chip size="xs" color="warning" coloringStyle="tonal">AUSSTEHEND</Chip>
    ),
    children: (
      <>
        <span className="typography-title-md">Mi. 8. Juli 2026</span>
        <span className="text-sm text-description">15:00 – 15:30 Uhr · Sprechzimmer 2</span>
      </>
    ),
    actions: (
      <>
        <Button size="sm" color="primary" className="rounded-full">Zusagen</Button>
        <Button size="sm" color="neutral" className="rounded-full">Ablehnen</Button>
      </>
    ),
  },
}

export const prescriptionRequest: Story = {
  args: {
    icon: <Pill/>,
    title: 'Rezept-Anfrage',
    subtitle: 'Folgeverordnung',
    color: 'primary',
    direction: 'incoming',
    badge: (
      <Chip size="xs" color="primary" coloringStyle="tonal">NEU</Chip>
    ),
    children: (
      <>
        <span className="typography-title-md">Ramipril 5mg</span>
        <span className="text-sm text-description">N2 · 50 Stück · zuletzt 12.05.2026</span>
      </>
    ),
    actions: (
      <>
        <Button size="sm" color="primary" className="rounded-full">Ausstellen</Button>
        <Button size="sm" color="neutral" className="rounded-full">Ablehnen</Button>
      </>
    ),
  },
}

export const referral: Story = {
  args: {
    icon: <Send/>,
    title: 'Überweisung',
    subtitle: 'Kardiologie',
    color: 'secondary',
    direction: 'outgoing',
    badge: (
      <Chip size="xs" color="secondary" coloringStyle="tonal">GESENDET</Chip>
    ),
    children: (
      <>
        <span className="typography-title-md">Dr. med. K. Brandt</span>
        <span className="text-sm text-description">Kardiologische Praxis am Markt</span>
      </>
    ),
  },
}
