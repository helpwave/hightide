import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import {
  Bell,
  ChevronRight
} from 'lucide-react-native'
import { action } from 'storybook/actions'

import {
  Card,
  Divider,
  ListActionItem,
  ThemedIcon,
  ThemedText,
  type ListItemContentOrder
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'

import {
  type ColorPairKey,
  StorybookHelper
} from '../../helper'

const contentOrders = ['titleFirst', 'subtitleFirst'] as const satisfies readonly ListItemContentOrder[]

const meta = {
  component: ListActionItem,
} satisfies Meta<typeof ListActionItem>

export default meta

type ListActionItemArgs = {
  title: string,
  subtitle: string,
  contentOrder: ListItemContentOrder,
  color: ColorPairKey | 'default',
  disabled: boolean,
  withLeading: boolean,
  withTrailing: boolean,
}

const ListActionItemDemo = ({
  title,
  subtitle,
  contentOrder,
  color,
  disabled,
  withLeading,
  withTrailing,
}: ListActionItemArgs) => {
  const { theme } = useTheme()
  const resolvedColor = color === 'default'
    ? undefined
    : theme.colors[color]
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
          <ListActionItem
            title={title}
            subtitle={subtitle}
            contentOrder={contentOrder}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            trailing={trailing}
            onPress={action('Pressed title + subtitle')}
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
            onPress={action('Pressed title + subtitle')}
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
            onPress={action('Pressed title + subtitle')}
          />
        </Card>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Card>
          <ListActionItem
            title={title}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            trailing={trailing}
            onPress={action('Pressed title only')}
          />
          <Divider />
          <ListActionItem
            title={title}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            trailing={trailing}
            onPress={action('Pressed title only')}
          />
          <Divider />
          <ListActionItem
            title={title}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            trailing={trailing}
            onPress={action('Pressed title only')}
          />
        </Card>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Card>
          <ListActionItem
            content={<ThemedText>{`${title} · custom content`}</ThemedText>}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            trailing={trailing}
            onPress={action('Pressed custom content')}
          />
          <Divider />
          <ListActionItem
            content={<ThemedText>{`${title} · custom content`}</ThemedText>}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            trailing={trailing}
            onPress={action('Pressed custom content')}
          />
          <Divider />
          <ListActionItem
            content={<ThemedText>{`${title} · custom content`}</ThemedText>}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            trailing={trailing}
            onPress={action('Pressed custom content')}
          />
        </Card>
      </View>
    </View>
  )
}

export const listActionItem: StoryObj<ListActionItemArgs> = {
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
    color: {
      control: 'select',
      options: ['default', ...StorybookHelper.colorPairSelect.options],
    },
    disabled: {
      control: 'boolean',
    },
    withLeading: {
      control: 'boolean',
    },
    withTrailing: {
      control: 'boolean',
    },
  },
  args: {
    title: 'Notifications',
    subtitle: 'Settings',
    contentOrder: 'titleFirst',
    color: 'default',
    disabled: false,
    withLeading: false,
    withTrailing: false,
  },
  render: (args) => <ListActionItemDemo {...args} />,
}
