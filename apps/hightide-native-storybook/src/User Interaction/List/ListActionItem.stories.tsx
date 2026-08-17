import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { Bell } from 'lucide-react-native'
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
  showSubtitle: boolean,
  useCustomContent: boolean,
  color: ColorPairKey | 'default',
  disabled: boolean,
  withLeading: boolean,
}

const ListActionItemDemo = ({
  title,
  subtitle,
  contentOrder,
  showSubtitle,
  useCustomContent,
  color,
  disabled,
  withLeading,
}: ListActionItemArgs) => {
  const { theme } = useTheme()
  const resolvedColor = color === 'default'
    ? undefined
    : theme.colors[color]

  return (
    <View style={{ padding: 16, maxWidth: 420 }}>
      <Card>
        <ListActionItem
          title={useCustomContent ? undefined : title}
          subtitle={useCustomContent || !showSubtitle ? undefined : subtitle}
          content={useCustomContent
            ? <ThemedText>{`${title} · custom content`}</ThemedText>
            : undefined}
          contentOrder={contentOrder}
          color={resolvedColor}
          disabled={disabled}
          leading={withLeading
            ? <ThemedIcon icon={Bell} />
            : undefined}
          onPress={action('Pressed')}
        />
        <Divider />
        <ListActionItem
          title="Title only"
          onPress={action('Pressed title only')}
        />
        <Divider />
        <ListActionItem
          title="With subtitle"
          subtitle="Optional subtitle"
          contentOrder={contentOrder}
          onPress={action('Pressed with subtitle')}
        />
      </Card>
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
    showSubtitle: {
      control: 'boolean',
    },
    useCustomContent: {
      control: 'boolean',
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
    title: 'Notifications',
    subtitle: 'Settings',
    contentOrder: 'titleFirst',
    showSubtitle: true,
    useCustomContent: false,
    color: 'default',
    disabled: false,
    withLeading: true,
  },
  render: (args) => <ListActionItemDemo {...args} />,
}
