import type { Meta, StoryObj  } from '@storybook/nextjs'
import { ThemeSelect } from '@/src/components/layout/dialog/premade/ThemeDialog'

const meta: Meta = {
  component: ThemeSelect,
}

export default meta
type Story = StoryObj<typeof meta>;

export const themeSelect: Story = {
  args: {
  }
}
