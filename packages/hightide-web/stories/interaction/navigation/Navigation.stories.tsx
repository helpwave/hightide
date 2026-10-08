import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navigation } from '../../../src/components/interaction/navigation/Navigation'

const meta = {
  component: Navigation,
} satisfies Meta<typeof Navigation>

export default meta
type Story = StoryObj<typeof meta>;

export const navigation: Story = {
  args: {
    items: [
      { label: 'helpwave', link: 'https://helpwave.de', external: true },
      {
        label: 'helpwave products', items: [
          { label: 'helpwave', link: 'https://helpwave.de', external: true },
          { label: 'tasks', link: 'https://helpwave.de/product/tasks', external: true },
        ]
      },
      { label: 'current page', link: '#' },
    ]
  },
}
