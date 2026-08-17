import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import {
  Bell,
  ChevronRight
} from 'lucide-react-native'

import {
  Card,
  Divider,
  ListItem,
  ThemedIcon,
  ThemedText,
  type ListItemContentOrder
} from '@helpwave/hightide-native/components'

const contentOrders = ['titleFirst', 'subtitleFirst'] as const satisfies readonly ListItemContentOrder[]

const meta = {
  component: ListItem,
} satisfies Meta<typeof ListItem>

export default meta

type ListItemArgs = {
  title: string,
  subtitle: string,
  contentOrder: ListItemContentOrder,
  withLeading: boolean,
  withTrailing: boolean,
}

const ListItemDemo = ({
  title,
  subtitle,
  contentOrder,
  withLeading,
  withTrailing,
}: ListItemArgs) => {
  const leading = withLeading
    ? <ThemedIcon icon={Bell} />
    : undefined
  const trailing = withTrailing
    ? <ThemedIcon icon={ChevronRight} />
    : undefined

  return (
    <View style={{ padding: 16, flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Card>
          <ListItem
            title={title}
            subtitle={subtitle}
            contentOrder={contentOrder}
            leading={leading}
            trailing={trailing}
          />
          <Divider />
          <ListItem
            title={title}
            subtitle={subtitle}
            contentOrder={contentOrder}
            leading={leading}
            trailing={trailing}
          />
          <Divider />
          <ListItem
            title={title}
            subtitle={subtitle}
            contentOrder={contentOrder}
            leading={leading}
            trailing={trailing}
          />
        </Card>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Card>
          <ListItem
            title={title}
            leading={leading}
            trailing={trailing}
          />
          <Divider />
          <ListItem
            title={title}
            leading={leading}
            trailing={trailing}
          />
          <Divider />
          <ListItem
            title={title}
            leading={leading}
            trailing={trailing}
          />
        </Card>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Card>
          <ListItem
            content={<ThemedText>{`${title} · custom content`}</ThemedText>}
            leading={leading}
            trailing={trailing}
          />
          <Divider />
          <ListItem
            content={<ThemedText>{`${title} · custom content`}</ThemedText>}
            leading={leading}
            trailing={trailing}
          />
          <Divider />
          <ListItem
            content={<ThemedText>{`${title} · custom content`}</ThemedText>}
            leading={leading}
            trailing={trailing}
          />
        </Card>
      </View>
    </View>
  )
}

export const listItem: StoryObj<ListItemArgs> = {
  argTypes: {
    title: {
      control: 'text',
    },
    subtitle: {
      control: 'text',
    },
    contentOrder: {
      control: 'select',
      options: contentOrders,
    },
    withLeading: {
      control: 'boolean',
    },
    withTrailing: {
      control: 'boolean',
    },
  },
  args: {
    title: 'Anna Müller',
    subtitle: 'Name',
    contentOrder: 'titleFirst',
    withLeading: false,
    withTrailing: false,
  },
  render: (args) => <ListItemDemo {...args} />,
}
