import type { Meta, StoryObj  } from '@storybook/nextjs'
import { ThemeIcon } from '@/src/components/layout/dialog/premade/ThemeDialog'

const meta: Meta = {
  component: ThemeIcon,
}

export default meta
type Story = StoryObj<typeof meta>;

export const themeIcon: Story = {
  args: {
    theme: 'light',
  }
}
