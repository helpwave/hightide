import type {
  Meta,
  StoryObj
} from '@storybook/react'
import { action } from 'storybook/actions'
import { Text } from 'react-native'

import { Pressable } from '@helpwave/hightide-native/components'

const meta = {
  component: Pressable,
  argTypes: {
    touchTarget: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Pressable>

export default meta
type Story = StoryObj<typeof meta>

export const pressable: Story = {
  args: {
    colors: {
      color: '#6750A4',
      onColor: '#00FF00',
    },
    touchTarget: 44,
    disabled: false,
    onPress: action('Pressed'),
    surfaceStyle: {
      height: 40,
      paddingHorizontal: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    children: (
      <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '500' }} numberOfLines={1}>
        Press me
      </Text>
    ),
  },
}

export const visualAlignment: Story = {
  args: {
    ...pressable.args,
    visualAlignment: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    style: {
      height: 40,
      width: 120,
      paddingHorizontal: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
}
