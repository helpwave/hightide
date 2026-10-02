import type { Meta, StoryObj  } from '@storybook/nextjs-vite'
import { ThemeSelect } from '../../../src/components/layout/Modal/ThemeModal'

const meta: Meta = {
  component: ThemeSelect,
}

export default meta
type Story = StoryObj<typeof meta>;

export const themeSelect: Story = {
  args: {
  }
}
