import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Bell, ChevronRight } from 'lucide-react'
import { Card } from '../../../src/components/display-and-visualization/Card'
import { Divider } from '../../../src/components/layout/Divider'
import { ListItem } from '../../../src/components/list/ListItem'
import type { ListItemContentOrder } from '../../../src/components/list/ListItemTypes'

const contentOrders = ['titleFirst', 'subtitleFirst'] as const satisfies readonly ListItemContentOrder[]

type StoryArgs = {
  title: string,
  subtitle: string,
  contentOrder: ListItemContentOrder,
  withLeading: boolean,
  withTrailing: boolean,
}

const meta: Meta<StoryArgs> = {
  component: ListItem,
  argTypes: {
    contentOrder: {
      control: 'select',
      options: contentOrders,
    },
    withLeading: { control: 'boolean' },
    withTrailing: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const listItem: Story = {
  args: {
    title: 'Anna Müller',
    subtitle: 'Name',
    contentOrder: 'subtitleFirst',
    withLeading: false,
    withTrailing: false,
  },
  render: ({ title, subtitle, contentOrder, withLeading, withTrailing }) => {
    const leading = withLeading ? <Bell className="size-force-5" /> : undefined
    const trailing = withTrailing ? <ChevronRight className="size-force-5" /> : undefined

    return (
      <Card className="max-w-md !p-0">
        <ListItem title={title} subtitle={subtitle} contentOrder={contentOrder} leading={leading} trailing={trailing} />
        <Divider />
        <ListItem title={title} subtitle={subtitle} contentOrder={contentOrder} leading={leading} trailing={trailing} />
        <Divider />
        <ListItem title={title} subtitle={subtitle} contentOrder={contentOrder} leading={leading} trailing={trailing} />
      </Card>
    )
  },
}
