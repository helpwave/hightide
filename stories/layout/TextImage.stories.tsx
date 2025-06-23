import type { Meta, StoryObj } from '@storybook/nextjs'
import { TextImage } from '../../src'

const meta = {
  title: 'Layout',
  component: TextImage,
} satisfies Meta<typeof TextImage>

export default meta
type Story = StoryObj<typeof meta>;

export const textImage: Story = {
  args: {
    title:'About helpwave',
    description: 'Regulatory burdens and high barriers to entry make it difficult for small companies to enter the market,' +
        ' leading to a lack of competition. helpwave is here to change that. We offer a platform that brings everyone to' +
        ' the table, not just the big companies.',
    imageUrl: 'https://helpwave.de/favicon.ico',
  },
}
