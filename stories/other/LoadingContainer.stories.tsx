import type { Meta, StoryObj } from '@storybook/nextjs'
import { LoadingContainer } from '@/src/components/loading-states/LoadingContainer'

const meta = {
  title: 'Other/Loading',
  component: LoadingContainer,
} satisfies Meta<typeof LoadingContainer>

export default meta
type Story = StoryObj<typeof meta>;

export const loadingContainer: Story = {
  args: {
    className: 'min-w-20 max-w-20 min-h-8 max-h-8'
  }
}
