import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { Bell, ChevronRight } from 'lucide-react'
import { Card } from '../../../src/components/layout/Card'
import { Divider } from '../../../src/components/layout/Divider'
import { ListActionItem } from '../../../src/components/layout/list/ListActionItem'
import type { ListItemColor, ListItemContentOrder } from '../../../src/components/layout/list/ListItemTypes'

const contentOrders = ['titleFirst', 'subtitleFirst'] as const satisfies readonly ListItemContentOrder[]
const colors = ['default', 'primary', 'secondary', 'positive', 'warning', 'negative', 'neutral'] as const

type StoryArgs = {
  title: string,
  subtitle: string,
  contentOrder: ListItemContentOrder,
  color: ListItemColor | 'default',
  disabled: boolean,
  withLeading: boolean,
  withTrailing: boolean,
}

const meta: Meta<StoryArgs> = {
  component: ListActionItem,
  argTypes: {
    contentOrder: {
      control: 'select',
      options: contentOrders,
    },
    color: {
      control: 'select',
      options: colors,
    },
    disabled: { control: 'boolean' },
    withLeading: { control: 'boolean' },
    withTrailing: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const listActionItem: Story = {
  args: {
    title: 'Notifications',
    subtitle: 'Practice alerts',
    contentOrder: 'titleFirst',
    color: 'default',
    disabled: false,
    withLeading: true,
    withTrailing: true,
  },
  render: ({ title, subtitle, contentOrder, color, disabled, withLeading, withTrailing }) => {
    const resolvedColor = color === 'default' ? undefined : color
    const leading = withLeading ? <Bell className="size-force-5" /> : undefined
    const trailing = withTrailing ? <ChevronRight className="size-force-5" /> : undefined

    return (
      <Card className="max-w-md !p-0">
        <ListActionItem
          title={title}
          subtitle={subtitle}
          contentOrder={contentOrder}
          color={resolvedColor}
          disabled={disabled}
          leading={leading}
          trailing={trailing}
          onClick={action('onClick')}
        />
        <Divider />
        <ListActionItem
          title={title}
          subtitle={subtitle}
          contentOrder={contentOrder}
          color={resolvedColor}
          disabled={disabled}
          leading={leading}
          trailing={trailing}
          onClick={action('onClick')}
        />
      </Card>
    )
  },
}
