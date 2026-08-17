import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { UserRound } from 'lucide-react-native'
import { action } from 'storybook/actions'

import {
  Card,
  Divider,
  ListNavigationItem,
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
  component: ListNavigationItem,
} satisfies Meta<typeof ListNavigationItem>

export default meta

type ListNavigationItemArgs = {
  title: string,
  subtitle: string,
  contentOrder: ListItemContentOrder,
  color: ColorPairKey | 'default',
  disabled: boolean,
  withLeading: boolean,
}

const ListNavigationItemDemo = ({
  title,
  subtitle,
  contentOrder,
  color,
  disabled,
  withLeading,
}: ListNavigationItemArgs) => {
  const { theme } = useTheme()
  const resolvedColor = color === 'default'
    ? undefined
    : theme.colors[color]
  const leading = withLeading
    ? <ThemedIcon icon={UserRound} />
    : undefined

  return (
    <View style={{ padding: 16, flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Card>
          <ListNavigationItem
            title={title}
            subtitle={subtitle}
            contentOrder={contentOrder}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            onPress={action('Pressed title + subtitle')}
          />
          <Divider />
          <ListNavigationItem
            title={title}
            subtitle={subtitle}
            contentOrder={contentOrder}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            onPress={action('Pressed title + subtitle')}
          />
          <Divider />
          <ListNavigationItem
            title={title}
            subtitle={subtitle}
            contentOrder={contentOrder}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            onPress={action('Pressed title + subtitle')}
          />
        </Card>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Card>
          <ListNavigationItem
            title={title}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            onPress={action('Pressed title only')}
          />
          <Divider />
          <ListNavigationItem
            title={title}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            onPress={action('Pressed title only')}
          />
          <Divider />
          <ListNavigationItem
            title={title}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            onPress={action('Pressed title only')}
          />
        </Card>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Card>
          <ListNavigationItem
            content={<ThemedText>{`${title} · custom content`}</ThemedText>}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            onPress={action('Pressed custom content')}
          />
          <Divider />
          <ListNavigationItem
            content={<ThemedText>{`${title} · custom content`}</ThemedText>}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            onPress={action('Pressed custom content')}
          />
          <Divider />
          <ListNavigationItem
            content={<ThemedText>{`${title} · custom content`}</ThemedText>}
            color={resolvedColor}
            disabled={disabled}
            leading={leading}
            onPress={action('Pressed custom content')}
          />
        </Card>
      </View>
    </View>
  )
}

export const listNavigationItem: StoryObj<ListNavigationItemArgs> = {
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
  },
  args: {
    title: 'Account',
    subtitle: 'Profile',
    contentOrder: 'titleFirst',
    color: 'default',
    disabled: false,
    withLeading: false,
  },
  render: (args) => <ListNavigationItemDemo {...args} />,
}
