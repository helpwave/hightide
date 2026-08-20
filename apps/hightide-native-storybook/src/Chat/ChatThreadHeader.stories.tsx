import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'
import { ChevronLeft } from 'lucide-react-native'

import {
  ChatThreadHeader,
  IconButton
} from '@helpwave/hightide-native/components'
import { HightideIconRegistry } from '@helpwave/hightide-native/icons'

const meta = {
  component: ChatThreadHeader,
} satisfies Meta<typeof ChatThreadHeader>

export default meta

type ChatThreadHeaderStoryArgs = {
  leadingAction: boolean,
  trailingAction: boolean,
}

const ChatThreadHeaderDemo = ({
  leadingAction,
  trailingAction,
}: ChatThreadHeaderStoryArgs) => (
  <View style={{ maxWidth: 420 }}>
    <ChatThreadHeader
      avatar={{
        name: 'Anna Wellermann',
      }}
      title="Dr. Anna Wellermann"
      subtitle="Online"
      leftActions={leadingAction ? (
        <IconButton
          variant="foreground"
          size="sm"
          icon={ChevronLeft}
          accessibilityLabel="Back"
          onPress={action('leading-action')}
        />
      ) : undefined}
      rightActions={trailingAction ? (
        <IconButton
          variant="foreground"
          size="sm"
          icon={HightideIconRegistry.ChevronRight}
          accessibilityLabel="Forward"
          onPress={action('trailing-action')}
        />
      ) : undefined}
    />
  </View>
)

export const chatThreadHeader: StoryObj<ChatThreadHeaderStoryArgs> = {
  argTypes: {
    leadingAction: {
      control: 'boolean',
    },
    trailingAction: {
      control: 'boolean',
    },
  },
  args: {
    leadingAction: false,
    trailingAction: false,
  },
  render: (args) => <ChatThreadHeaderDemo {...args} />,
}
