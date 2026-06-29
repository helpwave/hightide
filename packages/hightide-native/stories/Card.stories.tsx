import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { ActionCard, Card, Text } from '../src'

const meta = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Patient summary',
    description: 'Last updated 2 minutes ago',
    size: 'md',
  },
}

export const WithBody: Story = {
  args: {
    title: 'Notes',
    size: 'md',
    children: <Text variant="bodyMd" color="description">Pinned note for the care team.</Text>,
  },
}

export const Action: StoryObj<typeof ActionCard> = {
  render: () => (
    <ActionCard
      title="Open record"
      description="Tap to view the full record"
      onPress={() => undefined}
    />
  ),
}
