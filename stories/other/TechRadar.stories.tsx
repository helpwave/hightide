import type { Meta, StoryObj } from '@storybook/react'
import { TechRadar } from '../../src/components/branding/TechRadar'

const meta = {
  title: 'Other/TechRadar',
  component: TechRadar,
} satisfies Meta<typeof TechRadar>

export default meta
type Story = StoryObj<typeof meta>;

export const TechRadarStory: Story = {
  render: () => <TechRadar />,
}
