import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { Badge, Divider, Spinner, Text } from '../src'
import type { TypographyVariantName } from '../src'

const meta = {
  title: 'Foundations',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const variants: TypographyVariantName[] = [
  'headlineLg', 'headlineMd', 'titleLg', 'titleMd', 'titleSm',
  'bodyLg', 'bodyMd', 'labelLg', 'labelMd', 'captionSm',
]

export const Typography: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      {variants.map((variant) => (
        <Text key={variant} variant={variant}>{variant}</Text>
      ))}
    </View>
  ),
}

export const Badges: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Badge color="primary">3</Badge>
      <Badge color="negative">99+</Badge>
      <Badge color="positive" coloringStyle="tonal">new</Badge>
      <Badge color="warning" dot />
    </View>
  ),
}

export const Loading: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Spinner />
      <Spinner color="neutral" />
      <Spinner size="large" color="secondary" />
    </View>
  ),
}

export const Dividers: Story = {
  render: () => (
    <View style={{ gap: 12, width: 240 }}>
      <Text variant="bodyMd">Above</Text>
      <Divider />
      <Text variant="bodyMd">Below</Text>
    </View>
  ),
}
