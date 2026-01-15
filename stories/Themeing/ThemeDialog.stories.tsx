import type { Meta, StoryObj  } from '@storybook/nextjs'
import { ThemeDialog } from '@/src/components/layout/dialog/premade/ThemeDialog'

const meta: Meta = {
  component: ThemeDialog,
}

export default meta
type Story = StoryObj<typeof meta>;

export const themeDialog: Story = {
  args: {
    isOpen: true,
  }
}
