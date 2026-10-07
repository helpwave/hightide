import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { UserRound } from 'lucide-react'
import { Card } from '../../../src/components/layout/Card'
import { Divider } from '../../../src/components/layout/Divider'
import { ListNavigationItem } from '../../../src/components/layout/list/ListNavigationItem'
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
  isExternal: boolean,
}

const meta: Meta<StoryArgs> = {
  component: ListNavigationItem,
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
    isExternal: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const listNavigationItem: Story = {
  args: {
    title: 'Account',
    subtitle: 'Profile and sign-in',
    contentOrder: 'titleFirst',
    color: 'default',
    disabled: false,
    withLeading: true,
    isExternal: false,
  },
  render: ({ title, subtitle, contentOrder, color, disabled, withLeading, isExternal }) => {
    const resolvedColor = color === 'default' ? undefined : color
    const leading = withLeading ? <UserRound className="size-force-5" /> : undefined

    return (
      <Card className="max-w-md !p-0">
        <ListNavigationItem
          title={title}
          subtitle={subtitle}
          contentOrder={contentOrder}
          color={resolvedColor}
          disabled={disabled}
          isExternal={isExternal}
          leading={leading}
          href="#account"
          onClick={action('onClick')}
        />
        <Divider />
        <ListNavigationItem
          title={title}
          subtitle={subtitle}
          contentOrder={contentOrder}
          color={resolvedColor}
          disabled={disabled}
          isExternal={isExternal}
          leading={leading}
          href="#account"
          onClick={action('onClick')}
        />
      </Card>
    )
  },
}
