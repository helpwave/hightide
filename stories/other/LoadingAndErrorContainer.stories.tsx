import type { Meta, StoryObj } from '@storybook/nextjs'
import { LoadingAndErrorComponent } from '../../src'

const meta = {
  title: 'Other/Loading',
  component: LoadingAndErrorComponent,
} satisfies Meta<typeof LoadingAndErrorComponent>

export default meta
type Story = StoryObj<typeof meta>;

export const loadingAndErrorContainer: Story = {
  args: {
    isLoading: true,
    hasError: true,
    className: 'min-w-20 max-w-20 min-h-8 max-h-8'
  }
}
