import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'

import type { DividerDirection } from '@helpwave/hightide-design/component-token-resolvers'
import {
  Divider,
  ThemedText
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'

import {
  colorPairKeys,
  type ColorPairKey
} from '../helper'

const meta = {
  component: Divider,
} satisfies Meta<typeof Divider>

export default meta

type DividerArgs = {
  direction: DividerDirection,
  color: ColorPairKey | 'default',
  width: number,
  margin: number,
}

const DividerDemo = ({
  direction,
  color,
  width,
  margin,
}: DividerArgs) => {
  const { theme } = useTheme()
  const resolvedColor = color === 'default'
    ? undefined
    : theme.colors[color].color

  if (direction === 'vertical') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'stretch', height: 120, padding: 16 }}>
        <ThemedText>Left</ThemedText>
        <Divider
          direction="vertical"
          color={resolvedColor}
          width={width}
          margin={margin}
        />
        <ThemedText>Right</ThemedText>
      </View>
    )
  }

  return (
    <View style={{ width: 280, padding: 16 }}>
      <ThemedText>Above</ThemedText>
      <Divider
        direction="horizontal"
        color={resolvedColor}
        width={width}
        margin={margin}
      />
      <ThemedText>Below</ThemedText>
    </View>
  )
}

export const divider: StoryObj<DividerArgs> = {
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'] satisfies DividerDirection[],
    },
    color: {
      control: 'select',
      options: ['default', ...colorPairKeys] as const,
    },
    width: {
      control: { type: 'number', min: 1, max: 8, step: 1 },
    },
    margin: {
      control: { type: 'number', min: 0, max: 32, step: 1 },
    },
  },
  args: {
    direction: 'horizontal',
    color: 'default',
    width: 1,
    margin: 8,
  },
  render: (args) => <DividerDemo {...args} />,
}
