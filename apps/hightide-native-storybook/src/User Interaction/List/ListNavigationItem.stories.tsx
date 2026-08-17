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
  showSubtitle: boolean,
  useCustomContent: boolean,
  color: ColorPairKey | 'default',
  disabled: boolean,
  withLeading: boolean,
}

const ListNavigationItemDemo = ({
  title,
  subtitle,
  contentOrder,
  showSubtitle,
  useCustomContent,
  color,
  disabled,
  withLeading,
}: ListNavigationItemArgs) => {
  const { theme } = useTheme()
  const resolvedColor = color === 'default'
    ? undefined
    : theme.colors[color]

  return (
    <View style={{ padding: 16, maxWidth: 420 }}>
      <Card>
        <ListNavigationItem
          title={useCustomContent ? undefined : title}
          subtitle={useCustomContent || !showSubtitle ? undefined : subtitle}
          content={useCustomContent
            ? <ThemedText>{`${title} · custom content`}</ThemedText>
            : undefined}
          contentOrder={contentOrder}
          color={resolvedColor}
          disabled={disabled}
          leading={withLeading
            ? <ThemedIcon icon={UserRound} />
            : undefined}
          onPress={action('Pressed')}
        />
        <Divider />
        <ListNavigationItem
          title="Title only"
          onPress={action('Pressed title only')}
        />
        <Divider />
        <ListNavigationItem
          title="With subtitle"
          subtitle="Optional subtitle"
          contentOrder={contentOrder}
          onPress={action('Pressed with subtitle')}
        />
      </Card>
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
    title: 'Account',
    subtitle: 'Profile',
    contentOrder: 'titleFirst',
    showSubtitle: true,
    useCustomContent: false,
    color: 'default',
    disabled: false,
    withLeading: true,
  },
  render: (args) => <ListNavigationItemDemo {...args} />,
}
