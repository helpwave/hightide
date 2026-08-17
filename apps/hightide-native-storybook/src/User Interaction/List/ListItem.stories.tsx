import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'

import {
  Card,
  Divider,
  ListItem,
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
  showSubtitle: boolean,
  useCustomContent: boolean,
}

const ListItemDemo = ({
  title,
  subtitle,
  contentOrder,
  showSubtitle,
  useCustomContent,
}: ListItemArgs) => (
  <View style={{ padding: 16, maxWidth: 420 }}>
    <Card>
      <ListItem
        title={useCustomContent ? undefined : title}
        subtitle={useCustomContent || !showSubtitle ? undefined : subtitle}
        content={useCustomContent
          ? <ThemedText>{`${title} · custom content`}</ThemedText>
          : undefined}
        contentOrder={contentOrder}
      />
      <Divider />
      <ListItem
        title="Title only"
      />
      <Divider />
      <ListItem
        title="With subtitle"
        subtitle="Optional subtitle"
        contentOrder={contentOrder}
      />
    </Card>
  </View>
)

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
    showSubtitle: {
      control: 'boolean',
    },
    useCustomContent: {
      control: 'boolean',
    },
  },
  args: {
    title: 'Anna Müller',
    subtitle: 'Name',
    contentOrder: 'titleFirst',
    showSubtitle: true,
    useCustomContent: false,
  },
  render: (args) => <ListItemDemo {...args} />,
}
